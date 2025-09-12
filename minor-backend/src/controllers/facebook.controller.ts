import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const facebookController = async (req, res, next) => {
    passport.authenticate("facebook", {session: false,
        scope: ["email"],
        })(req, res);
        next();
        
}

export const facebookCallback = async (req, res) => {
    passport.authenticate("facebook", {session: false,
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