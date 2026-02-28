const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get upcoming wellness events for the user
 */
const getEvents = async (req, res) => {
    try {
        const events = await prisma.wellnessEvent.findMany({
            where: {
                scheduledAt: { gte: new Date() }
            },
            orderBy: { scheduledAt: 'asc' },
            include: {
                _count: {
                    select: { participants: true }
                }
            }
        });

        // Get user's current participations to mark which they've joined
        const participations = await prisma.eventParticipation.findMany({
            where: { userId: req.user.id }
        });
        const joinedEventIds = new Set(participations.map(p => p.eventId));

        const formatted = events.map(e => ({
            id: e.id,
            name: e.name,
            type: e.type,
            description: e.description,
            location: e.location,
            scheduledAt: e.scheduledAt,
            durationMins: e.durationMins,
            maxCapacity: e.maxCapacity,
            currentParticipants: e._count.participants,
            isJoined: joinedEventIds.has(e.id)
        }));

        res.json(formatted);
    } catch (error) {
        console.error('getEvents error:', error);
        res.status(500).json({ message: 'Failed to fetch wellness events.' });
    }
};

/**
 * Join a wellness event
 */
const joinEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        const event = await prisma.wellnessEvent.findUnique({
            where: { id: eventId },
            include: { _count: { select: { participants: true } } }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        if (event.maxCapacity && event._count.participants >= event.maxCapacity) {
            return res.status(400).json({ message: 'Event is full.' });
        }

        const participation = await prisma.eventParticipation.create({
            data: {
                userId,
                eventId,
                status: 'REGISTERED'
            }
        });

        res.status(201).json({ message: 'Successfully joined event.', participation });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'You have already joined this event.' });
        }
        console.error('joinEvent error:', error);
        res.status(500).json({ message: 'Failed to join event.' });
    }
};

/**
 * Leave a wellness event
 */
const leaveEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        await prisma.eventParticipation.delete({
            where: {
                userId_eventId: {
                    userId,
                    eventId
                }
            }
        });

        res.json({ message: 'Successfully left event.' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(400).json({ message: 'You are not registered for this event.' });
        }
        console.error('leaveEvent error:', error);
        res.status(500).json({ message: 'Failed to leave event.' });
    }
};

module.exports = { getEvents, joinEvent, leaveEvent };
