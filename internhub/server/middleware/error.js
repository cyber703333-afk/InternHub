exports.notFound = (req, res, next) => { res.status(404); next(new Error(`Route not found: ${req.originalUrl}`)); };
exports.errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join(', '); }
  if (err.name === 'CastError') { status = 400; message = 'Invalid id.'; }
  if (err.code === 11000) { status = 409; message = 'This record already exists.'; }
  if (err.name === 'MulterError') { status = 400; }
  res.status(status).json({ message });
};
exports.sanitize = (req, res, next) => {
  const clean = (o) => { if (o && typeof o === 'object') for (const k of Object.keys(o)) { if (k.startsWith('$') || k.includes('.')) delete o[k]; else clean(o[k]); } };
  clean(req.body); clean(req.params); next();
};
