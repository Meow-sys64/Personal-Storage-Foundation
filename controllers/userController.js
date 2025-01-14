
//const db = require('../db/pool')
const {body, validationResult} = require('express-validator')
//const { genHash } = require('../lib/passwordUtils')
const passport = require('passport');

module.exports = {
    async getRegister(req, res, next){

        res.send("in register route")
    },
    async postRegister(req,res,next){

    },
    async getLogin(req,res,next){
    res.send("in login route")
  }
}
