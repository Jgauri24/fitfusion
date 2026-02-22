const mongoose = require('mongoose');

const moodCheckInSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    moodScore: { type: Number, required: true, min: 0, max: 4 },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoodCheckIn', moodCheckInSchema);
