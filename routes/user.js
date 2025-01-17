/*
 * Login
 * Register
 * Get User (admin?)
 * Delete User
 */

const router = require('express').Router()
const userController = require('../controllers/userController')
const passport = require('passport');

router.get('/login',userController.getLogin)
router.get('/register',userController.getRegister)
router.post('/login',userController.postLogin)
router.post('/register',userController.postRegister)

module.exports = router
