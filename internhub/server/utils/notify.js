const Notification = require('../models/Notification');
module.exports = (user, message, link = '') => Notification.create({ user, message, link });
