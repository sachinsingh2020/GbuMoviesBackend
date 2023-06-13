import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import ErrorHandler from "../utils/errorHandler.js";
import { Movie } from "../models/movieModel.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const createMovie = catchAsyncError(async (req, res, next) => {
    let { name, releaseDate, filmIndustry } = req.body;
    const genres = req.body.genre;
    const audios = req.body.audio;
    const { quality1080, quality1080link, quality720, quality720link, quality480, quality480link } = req.body;


    if (!name || !releaseDate) {
        return next(new ErrorHandler('All fields are required', 400));
    }

    const qualityArray = [];
    if (quality1080) {
        qualityArray.push({
            qualityName: quality1080,
            qualityLink: quality1080link
        });
    }
    if (quality720) {
        qualityArray.push({
            qualityName: quality720,
            qualityLink: quality720link
        });
    }
    if (quality480) {
        qualityArray.push({
            qualityName: quality480,
            qualityLink: quality480link
        });
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
        quality: qualityArray,
        image: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        },
        filmIndustry,
    })

    await movie.save();

    // console.log(movie);

    res.status(201).json({
        success: true,
        movie,
        message: 'Movie created successfully',
    });
})

export const getMovies = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 10;
    const moviesCount = await Movie.countDocuments();
    const apiFeatures = new ApiFeatures(Movie.find(), req.query).search().filter();
    const allMovies = await apiFeatures.query;
    const reversedMovies = allMovies.reverse();
    let filteredMoviesCount = reversedMovies.length;


    // Pagination
    const page = Number(req.query.page) || 1;
    const startIndex = (page - 1) * resultPerPage;
    const endIndex = page * resultPerPage;
    const paginatedMovies = reversedMovies.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        movies: paginatedMovies,
        moviesCount,
        resultPerPage,
        filteredMoviesCount,
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

export const getMovieDetail = catchAsyncError(async (req, res, next) => {

    const movie = await Movie.findById(req.params.id);

    if (!movie) return next(new ErrorHandler("Movie not found", 404));

    res.status(200).json({
        success: true,
        movie,
    });
});

export const totalMovies = catchAsyncError(async (req, res, next) => {
    const totalMovies = await Movie.countDocuments();
    res.status(200).json({
        success: true,
        totalMovies,
    });
});