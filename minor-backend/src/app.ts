import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDb } from './db/db';

// Load environment variables from the .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;  // Use process.env.PORT from the .env file

// Connect to the database
connectDb();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
// IMPORT ROUTES
import authRoute from './route/auth.route';



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/v1/auth', authRoute);

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
