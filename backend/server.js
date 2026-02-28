require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Import Database Connections
const connectMongo = require('./config/mongo');
const { PrismaClient } = require('@prisma/client');
const { startAutoUpdater } = require('./utils/autoUpdater');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma
const prisma = new PrismaClient();

// Connect MongoDB (Unstructured Data) then start auto-updater
connectMongo().then(() => {
    startAutoUpdater(30); // Generate new data every 30 minutes
});

// Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS

// Parse incoming JSON payloads
app.use(express.json());

// Rate Limiting to prevent brute-force attacks
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use('/api/', apiLimiter);

// Stubbed Route Imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// API Routes setup with prefix
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/health', async (req, res) => {
    try {
        // Check DB connections if necessary. Here we just return OK.
        res.status(200).json({ status: 'OK', message: 'VITA API Gateway is running smoothly.' });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: 'Service unavailable' });
    }
});

app.get('/', (req, res) => {
    res.send('VITA API Gateway is running smoothly.');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`VITA API Gateway listening on port ${PORT}`);
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await prisma.$disconnect();
    server.close(() => {
        process.exit(0);
    });
});