const Movie = require('./models/Movie');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seedData() {
    try {
        // Clear existing data
        await Movie.deleteMany({});
        await User.deleteMany({});

        // Create sample movies
        const movies = [
            {
                title: "The Dark Knight",
                description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                genre: ["Action", "Crime", "Drama"],
                duration: 152,
                rating: 9.0,
                posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
                price: 12.99,
                showTimes: [
                    {
                        time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                        availableSeats: Array(8).fill().map(() => Array(10).fill(true))
                    },
                    {
                        time: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
                        availableSeats: Array(8).fill().map(() => Array(10).fill(true))
                    }
                ]
            },
            {
                title: "Inception",
                description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                genre: ["Action", "Adventure", "Sci-Fi"],
                duration: 148,
                rating: 8.8,
                posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
                price: 12.99,
                showTimes: [
                    {
                        time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                        availableSeats: Array(8).fill().map(() => Array(10).fill(true))
                    },
                    {
                        time: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
                        availableSeats: Array(8).fill().map(() => Array(10).fill(true))
                    }
                ]
            },
            {
                title: "Interstellar",
                description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                genre: ["Adventure", "Drama", "Sci-Fi"],
                duration: 169,
                rating: 8.6,
                posterUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
                price: 12.99,
                showTimes: [
                    {
                        time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                        availableSeats: Array(8).fill().map(() => Array(10).fill(true))
                    },
                    {
                        time: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
                        availableSeats: Array(8).fill().map(() => Array(10).fill(true))
                    }
                ]
            }
        ];

        // Insert movies
        await Movie.insertMany(movies);

        // Create a sample user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: hashedPassword
        });
        await user.save();

        console.log('Sample data seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

// Export the function
module.exports = seedData;

// If running this file directly, seed the data
if (require.main === module) {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1:27017/movie-ticket-db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('MongoDB connected for seeding...');
        return seedData();
    })
    .then(() => {
        console.log('Seeding completed');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
}
