const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const fail = (res, code, msg) => { res.status(code); throw new Error(msg); };
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, companyName, phone } = req.body;
  if (!name || !email || !password) fail(res, 400, 'Name, email and password are required.');
  if (!emailRx.test(email)) fail(res, 400, 'Enter a valid email address.');
  if (password.length < 6) fail(res, 400, 'Password must be at least 6 characters.');
  if (!['student', 'company'].includes(role)) fail(res, 400, 'Choose whether you are a student or a company.');
  if (role === 'company' && !companyName) fail(res, 400, 'Company name is required.');
  if (await User.findOne({ email: email.toLowerCase() })) fail(res, 409, 'An account with this email already exists.');
  const user = await User.create({ name, email, password, role, phone, companyName: role === 'company' ? companyName : undefined });
  user.password = undefined;
  res.status(201).json({ token: sign(user._id), user });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) fail(res, 400, 'Enter your email and password.');
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) fail(res, 401, 'Incorrect email or password.');
  if (user.isBlocked) fail(res, 403, 'Your account has been blocked by an admin.');
  user.password = undefined;
  res.json({ token: sign(user._id), user });
});

exports.me = asyncHandler(async (req, res) => res.json({ user: req.user }));

const ALLOWED = ['name', 'phone', 'college', 'course', 'linkedin', 'github', 'about', 'companyName', 'industry', 'website', 'location', 'description'];
exports.updateMe = asyncHandler(async (req, res) => {
  ALLOWED.forEach((k) => { if (req.body[k] !== undefined) req.user[k] = req.body[k]; });
  if (req.body.skills !== undefined) {
    req.user.skills = Array.isArray(req.body.skills) ? req.body.skills : String(req.body.skills).split(',').map((s) => s.trim()).filter(Boolean);
  }
  await req.user.save();
  res.json({ user: req.user });
});

exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) fail(res, 400, 'Choose a PDF, DOC or DOCX file to upload.');
  req.user.resume = `/uploads/${req.file.filename}`;
  await req.user.save();
  res.json({ user: req.user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword || ''))) fail(res, 400, 'Current password is incorrect.');
  if (!newPassword || newPassword.length < 6) fail(res, 400, 'New password must be at least 6 characters.');
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated.' });
});
