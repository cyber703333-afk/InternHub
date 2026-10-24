const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const auth = require('../controllers/authController');
const intern = require('../controllers/internshipController');
const apps = require('../controllers/applicationController');
const saved = require('../controllers/savedController');
const notif = require('../controllers/notificationController');
const admin = require('../controllers/adminController');

// Auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', protect, auth.me);
router.put('/auth/me', protect, auth.updateMe);
router.post('/auth/me/resume', protect, upload.single('resume'), auth.uploadResume);
router.put('/auth/password', protect, auth.changePassword);

// Internships
router.get('/internships', intern.list);
router.get('/internships/mine', protect, authorize('company'), intern.mine);
router.get('/internships/:id', intern.getOne);
router.post('/internships', protect, authorize('company'), intern.create);
router.put('/internships/:id', protect, authorize('company', 'admin'), intern.update);
router.delete('/internships/:id', protect, authorize('company', 'admin'), intern.remove);

// Applications
router.get('/applications/my', protect, authorize('student'), apps.myApplications);
router.get('/applications/internship/:id', protect, authorize('company'), apps.forInternship);
router.post('/applications/:internshipId', protect, authorize('student'), upload.single('resume'), apps.apply);
router.put('/applications/:id/status', protect, authorize('company'), apps.updateStatus);
router.delete('/applications/:id', protect, authorize('student'), apps.withdraw);

// Saved
router.get('/saved', protect, authorize('student'), saved.list);
router.post('/saved/:internshipId', protect, authorize('student'), saved.save);
router.delete('/saved/:internshipId', protect, authorize('student'), saved.remove);

// Notifications
router.get('/notifications', protect, notif.list);
router.put('/notifications/read-all', protect, notif.readAll);

// Admin
router.use('/admin', protect, authorize('admin'));
router.get('/admin/stats', admin.stats);
router.get('/admin/users', admin.users);
router.put('/admin/users/:id/block', admin.toggleBlock);
router.delete('/admin/users/:id', admin.deleteUser);
router.get('/admin/internships', admin.internships);
router.put('/admin/internships/:id/status', admin.setInternshipStatus);
router.get('/admin/applications', admin.applications);

module.exports = router;
