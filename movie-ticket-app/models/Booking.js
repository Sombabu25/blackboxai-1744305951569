const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    showTime: {
        type: Date,
        required: true
    },
    seats: {
        type: [{
            row: Number,
            column: Number
        }],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'confirmed'
    }
});

// After saving a booking, update the user's booking history
bookingSchema.post('save', async function(doc) {
    try {
        const User = mongoose.model('User');
        await User.findByIdAndUpdate(
            doc.userId,
            { $push: { bookingHistory: doc._id } }
        );
    } catch (error) {
        console.error('Error updating user booking history:', error);
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
