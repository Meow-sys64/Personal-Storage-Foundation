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

router.post('/upload', indexController.upload)
router.get('/folder/:folderId', indexController.getFolder)

router.get('/file/:fileId',indexController.getFile)
router.get('/temp_file_storage/:fileUrl/download',indexController.downloadFile)

module.exports = router
