// Learning: Using dotenv to load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const client = require('prom-client'); // For Prometheus metrics (learned about this in class)
const winston = require('winston'); // For logging (bonus task requirement)

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT not set

// Setting up Winston logger - first time using this!
// Learned that JSON format is better for log aggregation tools like Loki
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'student-management-system' }, // Tag all logs with service name
  transports: [
    // Output logs to console - Promtail will pick them up from Docker logs
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Error handling - learned this is important for production apps
// Catches errors that weren't handled properly
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1); // Exit if something really bad happens
});

// Catches promise rejections that weren't caught
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

// Prometheus setup - for monitoring (required for assignment)
// This collects default system metrics like CPU, memory, etc.
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Creating custom metrics to track HTTP requests
// Histogram tracks how long requests take
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Counter tracks total number of requests
const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'] // Can filter by these labels in Grafana
});

// Register the metrics so Prometheus can scrape them
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);

// Middleware to track all HTTP requests
// This runs before every request - learned about middleware in Express tutorial
app.use((req, res, next) => {
  const start = Date.now(); // Record start time
  
  // When response finishes, calculate duration and log
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const route = req.route ? req.route.path : req.path; // Get the route path
    
    // Update Prometheus metrics
    httpRequestDuration.labels(req.method, route, res.statusCode).observe(duration);
    httpRequestTotal.labels(req.method, route, res.statusCode).inc();
    
    // Log the request - this goes to Loki via Promtail
    logger.info('HTTP Request', {
      method: req.method,
      path: route,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(3)}s`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  next();
});

// Basic middleware setup
app.use(cors()); // Allow requests from frontend (learned about CORS issues)
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from public folder

// MongoDB connection - first time using Mongoose!
// Using environment variable or default to local MongoDB in Docker
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/studentdb';

// Connect to MongoDB - learned about async/await and promises
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Wait 5 seconds before giving up
  socketTimeoutMS: 45000, // Keep connection alive for 45 seconds
})
  .then(() => {
    // Success! Log it (hiding password in logs for security)
    logger.info('Connected to MongoDB', { uri: MONGODB_URI.replace(/\/\/.*@/, '//***@') });
    console.log('✅ MongoDB connected successfully!');
  })
  .catch((err) => {
    logger.error('MongoDB connection error', { error: err.message, stack: err.stack });
    console.error('❌ MongoDB connection failed:', err.message);
  });

// Event listeners for MongoDB connection
// These help debug connection issues
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error', { error: err.message, stack: err.stack });
  console.error('❌ MongoDB error:', err.message);
});

// Student Schema - defining the structure of student documents
// Learned about Mongoose schemas from documentation
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Name is required, trim whitespace
  age: { type: Number, required: true, min: 1 }, // Age must be at least 1
  course: { type: String, required: true, trim: true } // Course is required
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create model from schema
const Student = mongoose.model('Student', studentSchema);

// Helper function to validate student data
// Learned about validation - important for data integrity
function validateStudent(student) {
  // Check name
  if (!student.name || student.name.trim() === '') {
    return { valid: false, message: 'Name cannot be empty' };
  }
  // Check age - must be a number and positive
  if (!student.age || isNaN(student.age) || student.age < 1) {
    return { valid: false, message: 'Age must be a valid number' };
  }
  // Check course
  if (!student.course || student.course.trim() === '') {
    return { valid: false, message: 'Course cannot be empty' };
  }
  return { valid: true }; // All checks passed
}

// Health check endpoint - required for assignment
// Used by monitoring tools to check if app is running
app.get('/health', async (req, res) => {
  try {
    // Check if MongoDB is connected (1 = connected, 0 = disconnected)
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(), // How long server has been running (in seconds)
      database: dbStatus,
      memory: process.memoryUsage() // Memory usage info
    };
    
    // If DB is connected, return 200, otherwise 503 (service unavailable)
    if (dbStatus === 'connected') {
      res.status(200).json(healthStatus);
    } else {
      res.status(503).json({ ...healthStatus, status: 'degraded' });
    }
  } catch (error) {
    // If something goes wrong, return error status
    res.status(503).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Metrics endpoint - Prometheus scrapes this endpoint
// Returns metrics in Prometheus format
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics()); // Return all registered metrics
  } catch (error) {
    res.status(500).end(error);
  }
});

// GET all students - REST API endpoint
// Learned about REST APIs and async/await
app.get('/api/students', async (req, res) => {
  try {
    logger.debug('Fetching all students');
    // Find all students, sort by newest first
    const students = await Student.find().sort({ createdAt: -1 });
    
    // Convert MongoDB _id to id for frontend (frontend expects 'id' not '_id')
    const formattedStudents = students.map(student => ({
      id: student._id.toString(), // MongoDB uses _id, convert to string
      name: student.name,
      age: student.age,
      course: student.course
    }));
    
    logger.info('Students fetched successfully', { count: formattedStudents.length });
    res.status(200).json(formattedStudents); // Send JSON response
  } catch (error) {
    logger.error('Error fetching students', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// GET student by ID - READ operation for single student
app.get('/api/students/:id', async (req, res) => {
  try {
    // Validate the ID format (MongoDB ObjectId format)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    // Find student by ID
    const student = await Student.findById(req.params.id);
    
    // Check if student exists
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Return student data
    res.status(200).json({
      id: student._id.toString(),
      name: student.name,
      age: student.age,
      course: student.course
    });
  } catch (error) {
    logger.error('Error fetching student', { id: req.params.id, error: error.message });
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

// POST create new student - CREATE operation
app.post('/api/students', async (req, res) => {
  try {
    // Extract data from request body
    const { name, age, course } = req.body;
    logger.info('Creating new student', { name, age, course });
    
    // Validate - check if all fields are provided
    if (!name || !age || !course) {
      logger.warn('Validation failed: missing fields', { name: !!name, age: !!age, course: !!course });
      return res.status(400).json({ message: 'All fields (name, age, course) are required' });
    }
    
    // Use validation helper function
    const validation = validateStudent({ name, age, course });
    if (!validation.valid) {
      logger.warn('Validation failed', { message: validation.message });
      return res.status(400).json({ message: validation.message });
    }
    
    // Create new student document
    const newStudent = new Student({
      name: name.trim(), // Remove extra spaces
      age: parseInt(age), // Convert to number
      course: course.trim()
    });
    
    // Save to database - this is async so we use await
    await newStudent.save();
    logger.info('Student created successfully', { id: newStudent._id.toString(), name: newStudent.name });
    console.log('✅ Student created:', newStudent.name);
    
    // Return created student with 201 status (created)
    res.status(201).json({
      id: newStudent._id.toString(),
      name: newStudent.name,
      age: newStudent.age,
      course: newStudent.course
    });
  } catch (error) {
    logger.error('Error creating student', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});

// PUT update student - UPDATE operation
app.put('/api/students/:id', async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      logger.warn('Invalid student ID format', { id: req.params.id });
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    // Get data from request body
    const { name, age, course } = req.body;
    logger.info('Updating student', { id: req.params.id, name, age, course });
    
    // Validate all fields exist
    if (!name || !age || !course) {
      logger.warn('Validation failed: missing fields', { name: !!name, age: !!age, course: !!course });
      return res.status(400).json({ message: 'All fields (name, age, course) are required' });
    }
    
    // Validate data format
    const validation = validateStudent({ name, age, course });
    if (!validation.valid) {
      logger.warn('Validation failed', { message: validation.message });
      return res.status(400).json({ message: validation.message });
    }
    
    // Update student in database
    // new: true returns updated document, runValidators runs schema validators
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        age: parseInt(age),
        course: course.trim()
      },
      { new: true, runValidators: true }
    );
    
    // Check if student was found
    if (!student) {
      logger.warn('Student not found for update', { id: req.params.id });
      return res.status(404).json({ message: 'Student not found' });
    }
    
    logger.info('Student updated successfully', { id: student._id.toString(), name: student.name });
    console.log('✅ Student updated:', student.name);
    
    // Return updated student
    res.status(200).json({
      id: student._id.toString(),
      name: student.name,
      age: student.age,
      course: student.course
    });
  } catch (error) {
    logger.error('Error updating student', { id: req.params.id, error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

// DELETE student - DELETE operation
app.delete('/api/students/:id', async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      logger.warn('Invalid student ID format', { id: req.params.id });
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    logger.info('Deleting student', { id: req.params.id });
    
    // Delete student from database
    const student = await Student.findByIdAndDelete(req.params.id);
    
    // Check if student existed
    if (!student) {
      logger.warn('Student not found for deletion', { id: req.params.id });
      return res.status(404).json({ message: 'Student not found' });
    }
    
    logger.info('Student deleted successfully', { id: req.params.id, name: student.name });
    console.log('🗑️ Student deleted:', student.name);
    
    // Return success message
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    logger.error('Error deleting student', { id: req.params.id, error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

// Start the server
// 0.0.0.0 means listen on all network interfaces (needed for Docker)
app.listen(PORT, '0.0.0.0', () => {
  logger.info('Server started', { port: PORT, environment: process.env.NODE_ENV || 'development' });
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
});

