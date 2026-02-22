const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');

// Apply auth constraints to all admin routes
router.use(verifyToken);
router.use(requireRole('ADMIN'));

router.get('/dashboard', (req, res) => {
    res.json({ message: 'Welcome to the Admin Dashboard' });
});

module.exports = router;
