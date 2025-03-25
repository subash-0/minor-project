import  jwt  from 'jsonwebtoken';
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";

import User  from "../models/User";
import { hashPassword } from "../utils/bcrypt";

export default passport.use(
    new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/v1/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
   async function(accessToken, refreshToken, profile, done) {
            try {
                
    let user = await User.findOne({ email: profile.emails[0].value });
    if(!user){
       user = await User.create({
        fullname: profile.displayName,
        email: profile.emails[0].value,
        password: await hashPassword(`${profile.id} + ${Date.now()}`),
      });
    }
    console.log(user);
   
    const token = jwt.sign({ userId: user._id, email:user.email, fullname : user.fullname }, process.env.JWT_SECRET, { expiresIn: '3d' });
    
      return done(null,token);
                
            } catch (error) {
                return done(error, null);
                
            }
    }

));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});