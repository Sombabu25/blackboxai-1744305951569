const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

// GET all movies
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Failed to fetch movies' });
    }
});

// GET single movie
router.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({ message: 'Failed to fetch movie details' });
    }
});

// POST create booking (protected route)
router.post('/bookings', auth, async (req, res) => {
    try {
        const { movieId, showTime, seats, totalAmount } = req.body;

        // Validate movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Find the show time and validate seats are available
        const showTimeIndex = movie.showTimes.findIndex(
            show => show.time.toISOString() === new Date(showTime).toISOString()
        );

        if (showTimeIndex === -1) {
            return res.status(400).json({ message: 'Invalid show time' });
        }

        // Validate seats are available
        for (const seat of seats) {
            if (!movie.showTimes[showTimeIndex].availableSeats[seat.row][seat.column]) {
                return res.status(400).json({ message: 'Selected seats are not available' });
            }
        }

        // Create booking
        const booking = new Booking({
            movieId,
            userId: req.userId,
            showTime,
            seats,
            totalAmount,
            status: 'confirmed'
        });

        const newBooking = await booking.save();

        // Update movie's available seats
        seats.forEach(seat => {
            movie.showTimes[showTimeIndex].availableSeats[seat.row][seat.column] = false;
        });
        await movie.save();

        // Populate movie details in the response
        await newBooking.populate('movieId').execPopulate();

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Failed to create booking' });
    }
});

// GET booking by ID (protected route)
router.get('/bookings/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.userId
        }).populate('movieId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Failed to fetch booking details' });
    }
});

// GET user's bookings (protected route)
router.get('/user/bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId })
            .populate('movieId')
            .sort({ bookingDate: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Failed to fetch booking history' });
    }
});

module.exports = router;
