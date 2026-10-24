const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) { res.status(401); throw new Error('Not logged in. Please log in to continue.'); }
  let decoded;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET); }
  catch { res.status(401); throw new Error('Session expired. Please log in again.'); }
  const user = await User.findById(decoded.id);
  if (!user) { res.status(401); throw new Error('Account no longer exists.'); }
  if (user.isBlocked) { res.status(403); throw new Error('Your account has been blocked by an admin.'); }
  req.user = user;
  next();
});

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) { res.status(403); return next(new Error('You do not have access to this action.')); }
  next();
};
