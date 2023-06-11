import express from 'express';
import singleUpload from '../middlewares/multer.js';
import { createMovie, deleteMovie, getMovies, getMovieDetail } from '../controllers/movieController.js';
import { isAuthenticated } from '../middlewares/auth.js';


const router = express.Router();

router.route('/createmovie').post(isAuthenticated, singleUpload, createMovie);

router.route('/getmovies').get(getMovies);

router.route('/deletemovie/:id').delete(isAuthenticated, deleteMovie);

router.route('/getmoviedetail/:id').get(getMovieDetail);

export default router;