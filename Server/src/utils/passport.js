import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { generateAccessAndRefereshTokens } from "../controllers/user.controller.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/api/v1/users/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          role: "user"
        });
      }

      // Generate JWT token
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);
      user.refreshToken = newRefreshToken;
      await user.save({ validateBeforeSave: false });
      return done(null, { user, accessToken: newAccessToken });
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.serializeUser((data, done) => {
  done(null, data.user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});