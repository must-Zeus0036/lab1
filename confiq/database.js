const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();


const url = process.env.CONNECTION_URL || 'mongodb://localhost my database_name';

const connectDB = async (url) => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = { connectDB };

