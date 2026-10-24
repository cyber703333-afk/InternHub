const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Saved = require('../models/Saved');
const asyncHandler = require('../utils/asyncHandler');
const notify = require('../utils/notify');

exports.stats = asyncHandler(async (req, res) => {
  const [students, companies, internships, pending, applications, byStatus, byCategory, recent] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'company' }),
    Internship.countDocuments(),
    Internship.countDocuments({ status: 'pending' }),
    Application.countDocuments(),
    Application.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    Internship.aggregate([{ $group: { _id: '$category', n: { $sum: 1 } } }, { $sort: { n: -1 } }, { $limit: 6 }]),
    Application.find().sort({ createdAt: -1 }).limit(5).populate('student', 'name').populate('internship', 'title'),
  ]);
  res.json({
    totals: { students, companies, internships, pendingInternships: pending, applications },
    byStatus: byStatus.map((x) => ({ label: x._id, value: x.n })),
    byCategory: byCategory.map((x) => ({ label: x._id || 'Other', value: x.n })),
    recent,
  });
});

exports.users = asyncHandler(async (req, res) => {
  const { role, q } = req.query;
  const f = {};
  if (role) f.role = role;
  if (q) { const rx = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); f.$or = [{ name: rx }, { email: rx }, { companyName: rx }]; }
  res.json({ items: await User.find(f).sort({ createdAt: -1 }).limit(200) });
});

exports.toggleBlock = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found.'); }
  if (user.role === 'admin') { res.status(400); throw new Error('Admin accounts cannot be blocked.'); }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found.'); }
  if (user.role === 'admin') { res.status(400); throw new Error('Admin accounts cannot be deleted.'); }
  if (user.role === 'company') {
    const ids = (await Internship.find({ company: user._id }).select('_id')).map((i) => i._id);
    await Promise.all([Internship.deleteMany({ company: user._id }), Application.deleteMany({ internship: { $in: ids } }), Saved.deleteMany({ internship: { $in: ids } })]);
  } else {
    await Promise.all([Application.deleteMany({ student: user._id }), Saved.deleteMany({ student: user._id })]);
  }
  await user.deleteOne();
  res.json({ message: 'User deleted.' });
});

exports.internships = asyncHandler(async (req, res) => {
  const f = req.query.status ? { status: req.query.status } : {};
  res.json({ items: await Internship.find(f).populate('company', 'companyName name').sort({ createdAt: -1 }).limit(200) });
});

exports.setInternshipStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending', 'closed'].includes(status)) { res.status(400); throw new Error('Choose a valid status.'); }
  const item = await Internship.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!item) { res.status(404); throw new Error('Internship not found.'); }
  await notify(item.company, `Your internship "${item.title}" was ${status} by an admin.`, '/company/internships');
  res.json({ item });
});

exports.applications = asyncHandler(async (req, res) => {
  const items = await Application.find().populate('student', 'name email').populate('internship', 'title').populate('company', 'companyName name').sort({ createdAt: -1 }).limit(200);
  res.json({ items });
});
