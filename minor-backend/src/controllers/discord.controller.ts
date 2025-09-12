import passport from "passport";
import { NextFunction, Request, Response } from 'express';

export const discordLogin = async (req, res, next) => {
    passport.authenticate("discord", {session: false,
        scope: ["identify", "email"],
        })(req, res);
        console.log(req.user);
        next();
        
}
interface User {
    // Define the properties of the user object here
    // Example:
    id: string;
    username: string;
    email: string;
    // Add other properties as needed
}

export const discordCallback = async (req: Request, res: Response): Promise<void> => {
    passport.authenticate("discord", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` })(req, res, () => {
        const user = req.user ;
       
        res.cookie('token', user, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3 * 24 * 3600 * 1000, // 3 days
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        res.redirect(`${process.env.FRONTEND_URL}`);
    });
}
