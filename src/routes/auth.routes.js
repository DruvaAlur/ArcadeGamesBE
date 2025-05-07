const Router = require("express");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = Router();

require("dotenv").config();
const passport = require("passport");
const jwt = require("jsonwebtoken");

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
  (req, res) => {
    console.log(res);

    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:3000/login-success?token=${token}`);
  }
);

module.exports = router;
