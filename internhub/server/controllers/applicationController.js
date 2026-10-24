const Application = require('../models/Application');
const Internship = require('../models/Internship');
const asyncHandler = require('../utils/asyncHandler');
const notify = require('../utils/notify');

exports.apply = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.internshipId);
  if (!internship || internship.status !== 'approved') { res.status(404); throw new Error('This internship is not open for applications.'); }
  if (internship.deadline && new Date(internship.deadline) < new Date()) { res.status(400); throw new Error('The deadline for this internship has passed.'); }
  const resume = req.file ? `/uploads/${req.file.filename}` : req.user.resume;
  if (!resume) { res.status(400); throw new Error('Upload a resume in your profile or attach one to this application.'); }
  if (await Application.findOne({ student: req.user._id, internship: internship._id })) { res.status(409); throw new Error('You have already applied to this internship.'); }
  const app = await Application.create({
    student: req.user._id, internship: internship._id, company: internship.company,
    coverLetter: req.body.coverLetter || '', resume, history: [{ status: 'Applied' }],
  });
  await notify(internship.company, `${req.user.name} applied for ${internship.title}.`, `/company/internships/${internship._id}/applicants`);
  res.status(201).json({ application: app });
});

exports.myApplications = asyncHandler(async (req, res) => {
  const items = await Application.find({ student: req.user._id })
    .populate({ path: 'internship', select: 'title location mode stipend company', populate: { path: 'company', select: 'companyName name' } })
    .sort({ createdAt: -1 });
  res.json({ items });
});

exports.forInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) { res.status(404); throw new Error('Internship not found.'); }
  if (String(internship.company) !== String(req.user._id)) { res.status(403); throw new Error('You can only view applicants for your own postings.'); }
  const items = await Application.find({ internship: internship._id })
    .populate('student', 'name email phone college course skills linkedin github about').sort({ createdAt: -1 });
  res.json({ internship, items });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!Application.STATUSES.includes(status)) { res.status(400); throw new Error('Choose a valid status.'); }
  const app = await Application.findById(req.params.id).populate('internship', 'title');
  if (!app) { res.status(404); throw new Error('Application not found.'); }
  if (String(app.company) !== String(req.user._id)) { res.status(403); throw new Error('You can only update applications for your own postings.'); }
  app.status = status;
  app.history.push({ status });
  await app.save();
  await notify(app.student, `Your application for ${app.internship.title} is now: ${status}.`, '/student/applications');
  res.json({ application: app });
});

exports.withdraw = asyncHandler(async (req, res) => {
  const app = await Application.findOne({ _id: req.params.id, student: req.user._id });
  if (!app) { res.status(404); throw new Error('Application not found.'); }
  await app.deleteOne();
  res.json({ message: 'Application withdrawn.' });
});
