import mongoose from "mongoose";
// MONGO_URI=mongodb://127.0.0.1/gbuMovies 
export const connectDB = async () => {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected with ${connection.host}`);
};
