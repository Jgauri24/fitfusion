const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

// Apply auth constraints to all admin routes
router.use(verifyToken);
router.use(requireRole('ADMIN'));

router.get('/dashboard/stats', dashboardController.getDashboardStats);

module.exports = router;

