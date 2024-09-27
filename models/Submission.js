const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  fileUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);