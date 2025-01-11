
import jwt from 'jsonwebtoken';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import User from '../models/User'; // Ensure this is the correct path to your User model
import dotenv from 'dotenv';
import { hashPassword } from '../utils/bcrypt';
import { Types } from 'mongoose';


// Load environment variables
dotenv.config();

interface GoogleProfile {
    _json: {
        email: string;
        name: string;
    };
}

interface User {
    _id: Types.ObjectId;
    email: string;
    fullname: string;

}

export default  passport.use( 
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "http://localhost:5000/api/v1/auth/google/callback", // Update this for production
            passReqToCallback: true,
        },
        async (request: any, accessToken: string, refreshToken: string, profile: GoogleProfile, done: (error: any, user?: any) => void) => {
            try {
                let user = await User.findOne({ email: profile._json.email });
                if (!user) {
                    user = await User.create({ email: profile._json.email, fullname: profile._json.name, password: await hashPassword(`${profile._json.email}+ ${Date.now().toLocaleString()}`) });
                }
                
                const token = jwt.sign({ userId: user._id, email: user.email, fullname: user.fullname }, process.env.JWT_SECRET as string, {
                    expiresIn: '3d',
                });
               

                return done(null, token);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
   
    done(null, user);
});


passport.deserializeUser((id: string, done: (err: any, user?: User | null) => void) => {
    User.findById(id, (err: any, user: User | null) => {
       
        done(err, {_id: user?._id, email: user?.email, fullname: user?.fullname});
    });
});

