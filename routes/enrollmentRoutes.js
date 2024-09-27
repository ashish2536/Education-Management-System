const express = require('express');
const { protect, admin, student } = require('../middleware/authMiddleware');
const { 
  enrollStudent, 
  removeStudentFromCourse, 
  getEnrollmentStatus 
} = require('../controllers/enrollmentController');
const router = express.Router();

router.post('/:courseId', protect, admin, enrollStudent);

router.delete('/:courseId/:studentId', protect, admin, removeStudentFromCourse);

router.get('/status/:courseId', protect, student, getEnrollmentStatus);

module.exports = router;