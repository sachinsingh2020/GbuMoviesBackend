import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ErrorMiddleware from './middlewares/Error.js';

config({
    path: "./config/config.env",
});
const app = express();


// middleware 
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

// importing and using routes 
import movie from './routes/movieRoute.js';
import user from './routes/userRoute.js';

app.use('/api/v1', movie);
app.use('/api/v1', user);


app.get('/', (req, res) => {
    res.send('<h1>Server Is Working</h1>');
})

export default app;

app.use(ErrorMiddleware);
