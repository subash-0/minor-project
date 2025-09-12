

import { Router } from "express";
import {login, signup,logout, authondicateTohome} from '../controllers/auth.controller';
import { authenticate } from "../middleware/authondicate";

import { googleCallback, googleController } from '../controllers/google.controller';
import { discordCallback, discordLogin } from "../controllers/discord.controller";
import { facebookCallback, facebookController } from "../controllers/facebook.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);


// google
router.get("/google", googleController);
router.get("/google/callback", googleCallback);


// discord
router.get("/discord", discordLogin);
router.get("/discord/redirect", discordCallback);


// facebook
router.get("/facebook", facebookController);
router.get("/facebook/callback", facebookCallback);
router.get("/go-home", authenticate,authondicateTohome);
router.get("/logout", authenticate, logout);


export default router;