const express = require('express');
const { protect, teacher, student } = require('../middleware/authMiddleware');
const { 
  assignGrade, 
  getGradesByCourse, 
  getStudentGrades 
} = require('../controllers/gradeController');
const router = express.Router();

router.post('/:courseId/:studentId', protect, teacher, assignGrade);

router.get('/course/:courseId', protect, teacher, getGradesByCourse);

router.get('/student/:studentId', protect, student, getStudentGrades);

module.exports = router;