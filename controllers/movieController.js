import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import ErrorHandler from "../utils/errorHandler.js";
import { Movie } from "../models/movieModel.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const createMovie = catchAsyncError(async (req, res, next) => {
    let { name, releaseDate, movieUrl, filmIndustry } = req.body;
    const genres = req.body.genre;
    const audios = req.body.audio;
    const qualities = req.body.quality;

    if (!name || !releaseDate) {
        return next(new ErrorHandler('All fields are required', 400));
    }
    const file = req.file;

    if (!file) {
        return next(new ErrorHandler('Please upload an image file', 400));
    }

    const fileUri = getDataUri(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    const movie = await Movie.create({
        name,
        releaseDate,
        genre: genres,
        audio: audios,
        quality: qualities,
        image: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        },
        movieUrl,
        filmIndustry,
    })

    await movie.save();

    console.log(movie);

    res.status(201).json({
        success: true,
        movie,
        message: 'Movie created successfully',
    });
})

export const getMovies = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 3;
    const apiFeatures = new ApiFeatures(Movie.find(), req.query).search().filter();
    const allMovies = await apiFeatures.query;
    const reversedMovies = allMovies.reverse();

    // Pagination
    const page = Number(req.query.page) || 1;
    const startIndex = (page - 1) * resultPerPage;
    const endIndex = page * resultPerPage;
    const paginatedMovies = reversedMovies.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        movies: paginatedMovies,
    });
});


export const deleteMovie = catchAsyncError(async (req, res, next) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
        return next(new ErrorHandler('Movie not found', 404));
    }

    await cloudinary.v2.uploader.destroy(movie.image.public_id);

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Movie deleted successfully',
    });
});