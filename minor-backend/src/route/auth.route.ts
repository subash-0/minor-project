

import { Router } from "express";
import {login, signup,logout, authondicateTohome} from '../controllers/auth.controller';
import { authenticate } from "../middleware/authondicate";

import { googleCallback, googleController } from '../controllers/google.controller';
import { discordCallback, discordLogin } from "../controllers/discord.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/google", googleController);

router.get("/discord", discordLogin);
router.get("/discord/redirect", discordCallback);
router.get("/google/callback", googleCallback);
router.get("/go-home", authenticate,authondicateTohome);
router.get("/logout", authenticate, logout);


export default router;