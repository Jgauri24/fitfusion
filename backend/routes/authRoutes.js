const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me — return logged-in user's profile
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Failed to fetch profile.' });
    }
});

// PUT /api/auth/profile — update name and email
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        // Check if email is taken by another user
        if (email) {
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing && existing.id !== req.user.id) {
                return res.status(400).json({ message: 'Email is already in use by another account.' });
            }
        }

        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(firstName && { firstName }),
                ...(lastName !== undefined && { lastName }),
                ...(email && { email })
            },
            select: { id: true, email: true, firstName: true, lastName: true, role: true }
        });

        res.json({ message: 'Profile updated successfully.', user: updated });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile.' });
    }
});

// PUT /api/auth/change-password
router.put('/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required.' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters.' });
        }

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { passwordHash: hashedPassword }
        });

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Failed to change password.' });
    }
});

module.exports = router;
