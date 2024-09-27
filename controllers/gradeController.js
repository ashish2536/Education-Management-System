const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');
const User = require('../models/userModel');

const assignGrade = asyncHandler(async (req, res) => {
    const { grade } = req.body;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to assign grades for this course');
    }

    const student = course.enrolledStudents.find(
        (s) => s.student.toString() === req.params.studentId
    );

    if (!student) {
        res.status(404);
        throw new Error('Student not enrolled in this course');
    }

    student.grade = grade;
    await course.save();

    res.json({ message: 'Grade assigned successfully' });
});

const getStudentGrades = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (!course.enrolledStudents.some(
        (student) => student.student.toString() === req.user._id.toString()
    )) {
        res.status(401);
        throw new Error('Not enrolled in this course');
    }

    const student = course.enrolledStudents.find(
        (s) => s.student.toString() === req.user._id.toString()
    );

    res.json({ grade: student.grade });
});

const getAllStudentGrades = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to view grades for this course');
    }

    const grades = course.enrolledStudents.map((student) => ({
        studentId: student.student,
        grade: student.grade,
    }));

    res.json(grades);
});

module.exports = {
    assignGrade,
    getStudentGrades,
    getAllStudentGrades,
};