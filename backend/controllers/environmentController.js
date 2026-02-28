const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a new environment zone reading (Admin only)
 */
const createZone = async (req, res) => {
    try {
        const { zone, aqi, noiseDb, temperature, humidity, crowdDensity, rainfall } = req.body;

        if (!zone || aqi == null || noiseDb == null || temperature == null || humidity == null) {
            return res.status(400).json({ message: 'zone, aqi, noiseDb, temperature, and humidity are required.' });
        }

        const reading = await prisma.environmentZone.create({
            data: {
                zone,
                aqi: parseInt(aqi),
                noiseDb: parseInt(noiseDb),
                temperature: parseFloat(temperature),
                humidity: parseFloat(humidity),
                crowdDensity: crowdDensity != null ? parseInt(crowdDensity) : null,
                rainfall: rainfall != null ? parseFloat(rainfall) : null,
            }
        });

        res.status(201).json({ message: 'Environment zone reading created.', reading });
    } catch (error) {
        console.error('createZone error:', error);
        res.status(500).json({ message: 'Failed to create zone reading.' });
    }
};

/**
 * Get all environment zone readings
 */
const getAllZones = async (req, res) => {
    try {
        const allReadings = await prisma.environmentZone.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Deduplicate: keep only the most recent reading per zone
        const latestZonesMap = new Map();
        for (const reading of allReadings) {
            if (!latestZonesMap.has(reading.zone)) {
                latestZonesMap.set(reading.zone, reading);
            }
        }

        const uniqueZones = Array.from(latestZonesMap.values());
        res.json(uniqueZones);
    } catch (error) {
        console.error('getAllZones error:', error);
        res.status(500).json({ message: 'Failed to fetch zone readings.' });
    }
};

module.exports = { createZone, getAllZones };
