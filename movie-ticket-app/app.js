const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const routes = require('./routes');
const authRoutes = require('./routes/auth');

// Load environment variables
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));

// API Routes
app.use('/api', routes);
app.use('/auth', authRoutes);

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

app.get('/movie/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'movie.html'));
});

app.get('/booking/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'booking.html'));
});

app.get('/confirmation/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'confirmation.html'));
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(__dirname, 'views', '404.html'));
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`MongoDB Connected: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie-ticket-db'}`);
});

module.exports = app;
