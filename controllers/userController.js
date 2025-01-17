const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { body, validationResult } = require('express-validator')
const { genHash } = require('../lib/passwordUtils')
const passport = require('passport');

module.exports = {
  async getRegister(req, res, next) {

    // res.send("in register route")
    res.render('register')
  },
  postRegister: [
    body("username")
      .notEmpty()
      .escape()
      .withMessage("Error with username format"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 charcters long.")
      .escape(),
    async (req, res, next) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("register", {
          errors: errors.array(),
        });
      }
      const { username, password } = req.body
      //check if username exists
      const checkName = await prisma.user.findUnique({
        where: {
          username: username
        }
      })
      if (checkName) {
        res.render("register", { errors: ["Username already exists"] })
      }
      //use create account
      const passwordHash = await genHash(password)
      await prisma.user.create({
        data: {
          username: username,
          password_hash: passwordHash
        }
      })
      res.redirect("/user/login")
    }],
  async getLogin(req, res, next) {
    res.render("login")
  },
  postLogin: [
    body("username")
      .notEmpty()
      .escape()
      .withMessage("Error with username format"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 charcters long.")
      .escape(),
    async (req, res, next) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("register", {
          errors: errors.array(),
        });
      }

      next()
    },

    passport.authenticate('local', { failureRedirect: '/user/login', successRedirect: '/' })
  ]
}
