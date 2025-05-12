import { Router } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import passport from "passport";
import authController from "../controllers/auth.controller.js";

const router = Router();
dotenv.config();

// Rest of your code using these imports...

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      // Create or fetch user from your DB here
      const user = { id: profile.id, email: profile.emails[0].value };
      done(null, user);
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  authController.login
);

export default router;
