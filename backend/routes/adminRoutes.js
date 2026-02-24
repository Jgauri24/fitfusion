const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');
const { createFoodItem, getAllFoodItems } = require('../controllers/foodItemController');
const { createZone, getAllZones } = require('../controllers/environmentController');

// Apply auth constraints to all admin routes
router.use(verifyToken);
router.use(requireRole('ADMIN'));

// Dashboard
router.get('/dashboard/stats', dashboardController.getDashboardStats);

// Food Items CRUD
router.get('/food-items', getAllFoodItems);
router.post('/food-items', createFoodItem);

// Environment Zones CRUD
router.get('/environment', getAllZones);
router.post('/environment', createZone);

module.exports = router;
