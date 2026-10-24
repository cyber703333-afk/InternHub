const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Saved = require('../models/Saved');
const asyncHandler = require('../utils/asyncHandler');

const FIELDS = ['title', 'description', 'category', 'stipend', 'duration', 'location', 'mode', 'openings', 'deadline'];
const pick = (body) => {
  const d = {};
  FIELDS.forEach((k) => { if (body[k] !== undefined && body[k] !== '') d[k] = body[k]; });
  if (body.skills !== undefined) d.skills = Array.isArray(body.skills) ? body.skills : String(body.skills).split(',').map((s) => s.trim()).filter(Boolean);
  return d;
};

exports.list = asyncHandler(async (req, res) => {
  const { q, category, mode, location, minStipend, sort = 'new' } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 9, 50);
  const filter = { status: 'approved' };
  if (q) {
    const rx = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: rx }, { description: rx }, { skills: rx }];
  }
  if (category) filter.category = category;
  if (mode) filter.mode = mode;
  if (location) filter.location = new RegExp(String(location).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (minStipend) filter.stipend = { $gte: Number(minStipend) };
  const sortBy = sort === 'stipend' ? { stipend: -1 } : { createdAt: -1 };
  const [items, total] = await Promise.all([
    Internship.find(filter).populate('company', 'companyName name location industry').sort(sortBy).skip((page - 1) * limit).limit(limit),
    Internship.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
});

exports.mine = asyncHandler(async (req, res) => {
  const items = await Internship.find({ company: req.user._id }).sort({ createdAt: -1 }).lean();
  const counts = await Application.aggregate([{ $match: { company: req.user._id } }, { $group: { _id: '$internship', n: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  res.json({ items: items.map((i) => ({ ...i, applicants: map[String(i._id)] || 0 })) });
});

exports.getOne = asyncHandler(async (req, res) => {
  const item = await Internship.findById(req.params.id).populate('company', 'companyName name location industry website description');
  if (!item) { res.status(404); throw new Error('Internship not found.'); }
  res.json({ item });
});

exports.create = asyncHandler(async (req, res) => {
  const data = pick(req.body);
  if (!data.title || !data.description) { res.status(400); throw new Error('Title and description are required.'); }
  const status = process.env.REQUIRE_APPROVAL === 'true' ? 'pending' : 'approved';
  const item = await Internship.create({ ...data, company: req.user._id, status });
  res.status(201).json({ item });
});

const owned = async (req, res) => {
  const item = await Internship.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('Internship not found.'); }
  if (req.user.role !== 'admin' && String(item.company) !== String(req.user._id)) { res.status(403); throw new Error('You can only change your own postings.'); }
  return item;
};

exports.update = asyncHandler(async (req, res) => {
  const item = await owned(req, res);
  Object.assign(item, pick(req.body));
  if (req.body.status === 'closed' || (req.body.status === 'approved' && item.status === 'closed')) item.status = req.body.status;
  await item.save();
  res.json({ item });
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await owned(req, res);
  await Promise.all([Application.deleteMany({ internship: item._id }), Saved.deleteMany({ internship: item._id }), item.deleteOne()]);
  res.json({ message: 'Internship deleted.' });
});
