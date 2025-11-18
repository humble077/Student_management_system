# Student Management System

A basic CRUD (Create, Read, Update, Delete) application for managing students.

## Features

- Add new students with Name, Age, and Course
- View all students in a table
- Edit existing students
- Delete students
- Form validation (client-side and server-side)
- Modern, responsive UI

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a specific student
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

## Validation Rules

- **Name**: Cannot be empty
- **Age**: Must be a valid number (greater than 0)
- **Course**: Cannot be empty

## Project Structure

```
Student-management-system/
├── server.js          # Express backend server
├── package.json       # Node.js dependencies
├── README.md          # This file
└── public/            # Frontend files
    ├── index.html     # Main HTML page
    ├── style.css      # Styling
    └── script.js      # Frontend JavaScript
```

