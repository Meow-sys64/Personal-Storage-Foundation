const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const validateHash = require("../lib/passwordUtils.js").validateHash;

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const verifyCallback = async (username, password, done) => {
  try {

    const user = await prisma.user.findUnique({
      where:{
      username: username
      }
    })

    if (!user) {
      return done(null, false);
    }

    const isValid = validateHash(password, user.password_hash);

    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    done(err);
  }

};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      }
    })
    done(null, user);
  } catch (err) {
    done(err); }
});
