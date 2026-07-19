const express = require('express');
const cors = require('cors');
const db = require('./database');
const authRoutes = require('./auth');
const movieRoutes = require('./movies');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.get('/', (req, res) => {
    res.send('Netflix Clone Backend is running.');
});

// Export the app for Vercel
module.exports = app;

// Only listen if not running on Vercel (local dev)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
