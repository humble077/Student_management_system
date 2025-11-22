// Use relative URL so it works both locally and on Render
// If running locally: http://localhost:3000/api/students
// If on Render: https://your-app.onrender.com/api/students
const API_BASE_URL = '/api/students';
let editingId = null;

// DOM Elements
const form = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const courseInput = document.getElementById('course');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const tbody = document.getElementById('students-tbody');

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        const studentData = {
            name: nameInput.value.trim(),
            age: parseInt(ageInput.value),
            course: courseInput.value.trim()
        };
        
        try {
            if (editingId) {
                await updateStudent(editingId, studentData);
            } else {
                await createStudent(studentData);
            }
            resetForm();
            loadStudents();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
});

// Cancel edit
cancelBtn.addEventListener('click', () => {
    resetForm();
});

// Form validation
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Validate Name
    if (!nameInput.value.trim()) {
        showError('name-error', 'Name cannot be empty');
        isValid = false;
    }
    
    // Validate Age
    const age = parseInt(ageInput.value);
    if (!ageInput.value || isNaN(age) || age < 1) {
        showError('age-error', 'Age must be a valid number');
        isValid = false;
    }
    
    // Validate Course
    if (!courseInput.value.trim()) {
        showError('course-error', 'Course cannot be empty');
        isValid = false;
    }
    
    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}

function clearErrors() {
    document.getElementById('name-error').textContent = '';
    document.getElementById('age-error').textContent = '';
    document.getElementById('course-error').textContent = '';
}

function resetForm() {
    form.reset();
    clearErrors();
    editingId = null;
    submitBtn.textContent = 'Add Student';
    formTitle.textContent = 'Add New Student';
    cancelBtn.style.display = 'none';
}

// API Functions
async function loadStudents() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Failed to load students');
        }
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Error loading students. Make sure the server is running.</td></tr>';
    }
}

async function createStudent(studentData) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create student');
    }
    
    return await response.json();
}

async function updateStudent(id, studentData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update student');
    }
    
    return await response.json();
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete student');
        }
        
        loadStudents();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function editStudent(student) {
    editingId = student.id; // This is now a string (MongoDB ObjectId), not a number
    nameInput.value = student.name;
    ageInput.value = student.age;
    courseInput.value = student.course;
    submitBtn.textContent = 'Update Student';
    formTitle.textContent = 'Edit Student';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

function displayStudents(students) {
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No students found. Add a new student to get started.</td></tr>';
        return;
    }
    
    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" data-student-id="${student.id}" data-student-name="${student.name.replace(/"/g, '&quot;')}" data-student-age="${student.age}" data-student-course="${student.course.replace(/"/g, '&quot;')}">Edit</button>
                    <button class="btn-delete" data-student-id="${student.id}">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to buttons
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const student = {
                id: btn.dataset.studentId, // Keep as string - MongoDB ObjectId is a string, not a number!
                name: btn.dataset.studentName,
                age: parseInt(btn.dataset.studentAge),
                course: btn.dataset.studentCourse
            };
            editStudent(student);
        });
    });
    
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            deleteStudent(btn.dataset.studentId); // Keep as string - MongoDB ObjectId is a string!
        });
    });
}

// Load students on page load
loadStudents();

