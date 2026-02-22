const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', journalSchema);
