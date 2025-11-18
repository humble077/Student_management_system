const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let students = [
  { id: 1, name: 'John Snow', age: 20, course: 'Computer Science' },
  { id: 2, name: 'Alexander', age: 22, course: 'Mathematics' }
];
let nextId = 3;

// Validation helper
function validateStudent(student) {
  if (!student.name || student.name.trim() === '') {
    return { valid: false, message: 'Name cannot be empty' };
  }
  if (!student.age || isNaN(student.age) || student.age < 1) {
    return { valid: false, message: 'Age must be a valid number' };
  }
  if (!student.course || student.course.trim() === '') {
    return { valid: false, message: 'Course cannot be empty' };
  }
  return { valid: true };
}

// GET all students
app.get('/api/students', (req, res) => {
  res.status(200).json(students);
});

// GET student by ID
app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  res.status(200).json(student);
});

// POST create new student
app.post('/api/students', (req, res) => {
  const { name, age, course } = req.body;
  
  // Validate all fields exist
  if (!name || !age || !course) {
    return res.status(400).json({ message: 'All fields (name, age, course) are required' });
  }
  
  const validation = validateStudent({ name, age, course });
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }
  
  const newStudent = {
    id: nextId++,
    name: name.trim(),
    age: parseInt(age),
    course: course.trim()
  };
  
  students.push(newStudent);
  res.status(200).json(newStudent);
});

// PUT update student
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, age, course } = req.body;
  
  const studentIndex = students.findIndex(s => s.id === id);
  
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  // Validate all fields exist
  if (!name || !age || !course) {
    return res.status(400).json({ message: 'All fields (name, age, course) are required' });
  }
  
  const validation = validateStudent({ name, age, course });
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }
  
  students[studentIndex] = {
    id: id,
    name: name.trim(),
    age: parseInt(age),
    course: course.trim()
  };
  
  res.status(200).json(students[studentIndex]);
});

// DELETE student
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(s => s.id === id);
  
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  students.splice(studentIndex, 1);
  res.status(200).json({ message: 'Student deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

