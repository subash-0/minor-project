import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const googleController = async (req, res, next) => {
    passport.authenticate("google", {session: false,
        scope: ["profile", "email"],
        })(req, res);
        next();
        
}

export const googleCallback = async (req, res) => {
    passport.authenticate("google", {session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login`,

        })(req, res, () => {
            const user= req.user;
          res.cookie('token', user, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3*24*3600*1000, // 3 days
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
            });
        
        res.redirect(`${process.env.FRONTEND_URL}`);
    });
}