const mongoose = require('mongoose');
const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];
const s = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  coverLetter: { type: String, default: '' },
  resume: String,
  status: { type: String, enum: STATUSES, default: 'Applied' },
  history: [{ status: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });
s.index({ student: 1, internship: 1 }, { unique: true });
module.exports = mongoose.model('Application', s);
module.exports.STATUSES = STATUSES;
