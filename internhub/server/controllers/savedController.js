const Saved = require('../models/Saved');
const asyncHandler = require('../utils/asyncHandler');

exports.save = asyncHandler(async (req, res) => {
  await Saved.updateOne({ student: req.user._id, internship: req.params.internshipId }, {}, { upsert: true });
  res.status(201).json({ message: 'Saved.' });
});
exports.list = asyncHandler(async (req, res) => {
  const rows = await Saved.find({ student: req.user._id }).populate({ path: 'internship', populate: { path: 'company', select: 'companyName name location' } }).sort({ createdAt: -1 });
  res.json({ items: rows.map((r) => r.internship).filter(Boolean) });
});
exports.remove = asyncHandler(async (req, res) => {
  await Saved.deleteOne({ student: req.user._id, internship: req.params.internshipId });
  res.json({ message: 'Removed.' });
});
