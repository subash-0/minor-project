import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDb } from './db/db';
import './strategies/google.strategies'; // Import the Google OAuth2 passport strategy
import './strategies/discord.strategies'; // Import the Discord OAuth2 passport strategy

// Load environment variables from the .env file
dotenv.config();

const app = express();
const port = parseInt(process.env.PORT as string, 10) || 8000;  // Use process.env.PORT from the .env file

// Connect to the database
connectDb();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
// IMPORT ROUTES
import authRoute from './route/auth.route';
import passport from 'passport';



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

app.use('/api/v1/auth', authRoute);


app.listen(port,'0.0.0.0', () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
