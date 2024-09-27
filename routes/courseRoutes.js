const express = require('express');
const { 
  getCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} = require('../controllers/courseController');
const { protect, admin, teacher } = require('../middleware/authMiddleware');

const router = express.Router();
router.route('/')
  .get(getCourses) 
  .post(protect, admin, createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(protect, teacher, updateCourse)  
  .delete(protect, admin, deleteCourse); 
module.exports = router;