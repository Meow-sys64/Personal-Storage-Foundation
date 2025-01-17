const router = require('express').Router()
const indexController = require('../controllers/indexController')
const passport = require('passport');
//const db = require('../db/pool')

/*
 * If not logged in and link doesn't contain a guest key, redirect to user login
 * CRUD Files/ folders
 * create guest link
*/

router.get('/',indexController.index)
router.get('/logout', indexController.logout)

module.exports = router
