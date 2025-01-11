import jwt from 'jsonwebtoken';
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import dotenv from 'dotenv';
import User from "../models/User";
import { hashPassword } from "../utils/bcrypt";
import { Document, Types } from 'mongoose';

dotenv.config();

var scopes = ['identify', 'email', 'guilds', 'guilds.join'];


interface ISerializedUser {
    _id: Types.ObjectId;
    email: string;
    fullname: string;
}
export default    passport.use(
    new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/v1/auth/discord/redirect',
    scope: scopes
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ email: profile.email });
            if (!user) {
                const hashedPassword = await hashPassword(profile.id);
                user = await User.create({
                    email: profile.email,
                    fullname: profile.username,
                    password: hashedPassword
                });
            }
            const token = jwt.sign({ userId: user._id, email:user.email, fullname : user.fullname }, process.env.JWT_SECRET, { expiresIn: '3d' });
            return done(null, token);
           
        } catch (err) {
            return done(err, null);
        }

    }));

passport.serializeUser((user, done) => {

    done(null, user);
});


    interface IUser extends Document {
        _id: Types.ObjectId;
        email: string;
        fullname: string;
        password: string;
    }


    passport.deserializeUser((id: string, done: (err: any, user?: ISerializedUser | null) => void) => {
        User.findById(id, (err: any, user: IUser | null) => {
            if (user) {
                done(err, { _id: user._id, email: user.email, fullname: user.fullname });
            } else {
                done(err, null);
            }
        });
    });




