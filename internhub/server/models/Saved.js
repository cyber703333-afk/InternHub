const mongoose = require('mongoose');
const s = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
}, { timestamps: true });
s.index({ student: 1, internship: 1 }, { unique: true });
module.exports = mongoose.model('Saved', s);
