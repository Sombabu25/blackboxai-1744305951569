const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    genre: [{
        type: String,
        required: true
    }],
    duration: {
        type: Number, // in minutes
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    posterUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    showTimes: [{
        time: {
            type: Date,
            required: true
        },
        availableSeats: {
            type: [[Boolean]], // 2D array representing seat availability
            default: function() {
                // Initialize a 8x10 seating arrangement with all seats available
                return Array(8).fill().map(() => Array(10).fill(true));
            }
        }
    }]
});

module.exports = mongoose.model('Movie', movieSchema);
