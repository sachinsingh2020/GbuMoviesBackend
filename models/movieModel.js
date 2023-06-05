import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Movie name is required'],
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    filmIndustry: {
        type: String,
        required: true,
    },
    genre: {
        type: [String],
        default: [],
    },
    audio: {
        type: [String],
        default: [],
    },
    quality: {
        type: [String],
        default: [],
    },
    image: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    movieUrl: {
        type: String,
        required: true,
    }
})

export const Movie = mongoose.model('Movie', schema);