const mongoose = require('mongoose');
const s = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, default: 'Other' },
  skills: [String],
  stipend: { type: Number, default: 0 },
  duration: String,
  location: String,
  mode: { type: String, enum: ['Remote', 'Onsite', 'Hybrid'], default: 'Onsite' },
  openings: { type: Number, default: 1 },
  deadline: Date,
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'closed'], default: 'approved', index: true },
}, { timestamps: true });
s.index({ title: 'text', description: 'text', skills: 'text' });
module.exports = mongoose.model('Internship', s);
