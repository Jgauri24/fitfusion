const mongoose = require('mongoose');

/**
 * Connects to MongoDB for unstructured, secure data (Encrypted_Journals).
 */
const connectMongo = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectMongo;
