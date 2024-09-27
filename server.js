const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8012;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});