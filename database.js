const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.warn("WARNING: No MONGO_URI environment variable found. The database will not connect in production.");
}

// Connect to MongoDB
mongoose.connect(MONGO_URI || 'mongodb://localhost:27017/netflix_clone').then(() => {
    console.log('Connected to MongoDB.');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
