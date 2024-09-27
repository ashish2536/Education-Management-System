const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const User = require('../models/User');

const enrollStudent = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    const student = await User.findById(req.params.studentId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (!student || student.role !== 'Student') {
        res.status(404);
        throw new Error('Student not found');
    }

    if (course.enrolledStudents.some((s) => s.student.toString() === req.params.studentId)) {
        res.status(400);
        throw new Error('Student is already enrolled in this course');
    }

    course.enrolledStudents.push({ student: req.params.studentId });
    await course.save();

    res.status(201).json({ message: 'Student enrolled successfully' });
});

const removeStudent = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    const student = await User.findById(req.params.studentId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (!student || student.role !== 'Student') {
        res.status(404);
        throw new Error('Student not found');
    }

    const enrolledIndex = course.enrolledStudents.findIndex(
        (s) => s.student.toString() === req.params.studentId
    );

    if (enrolledIndex === -1) {
        res.status(400);
        throw new Error('Student is not enrolled in this course');
    }

    course.enrolledStudents.splice(enrolledIndex, 1);
    await course.save();

    res.json({ message: 'Student removed from the course' });
});

const getEnrolledCourses = asyncHandler(async (req, res) => {
    const student = req.user;

    if (!student || student.role !== 'Student') {
        res.status(401);
        throw new Error('Not authorized');
    }

    const courses = await Course.find({ 'enrolledStudents.student': student._id });

    res.json(courses);
});

const submitAssignment = asyncHandler(async (req, res) => {
    const { submission } = req.body;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const student = course.enrolledStudents.find(
        (s) => s.student.toString() === req.user._id.toString()
    );

    if (!student) {
        res.status(400);
        throw new Error('Student is not enrolled in this course');
    }

    student.submissions.push({ submission, date: Date.now() });
    await course.save();

    res.json({ message: 'Assignment submitted successfully' });
});

const viewSubmissions = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const student = course.enrolledStudents.find(
        (s) => s.student.toString() === req.user._id.toString()
    );

    if (!student) {
        res.status(400);
        throw new Error('Student is not enrolled in this course');
    }

    res.json(student.submissions);
});

module.exports = {
    enrollStudent,
    removeStudent,
    getEnrolledCourses,
    submitAssignment,
    viewSubmissions,
};