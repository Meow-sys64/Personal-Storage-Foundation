
//const db = require('../db/pool')
const { body, validationResult } = require('express-validator')
//const { genHash } = require('../lib/passwordUtils')
const passport = require('passport');
const multer = require('multer')
const upload = multer({ dest: './temp_file_storage/' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
  async index(req, res, next) {
    //// res.send('Hoi from index controller')
    //const SQL = `
    //SELECT messages.id, user_id, username, content
    //FROM messages
    //INNER JOIN users ON users.id = messages.user_id
    //;
    //`
    //const {rows:messages} = await db.query(SQL)
    //
    //if(req.session.passport?.user){
    //    const {rows} = await db.query(`
    //        SELECT id, username, ismember, isadmin
    //        FROM users
    //        WHERE id = ($1);
    //        `,[req.session.passport?.user])
    //    const user = rows[0]      
    //    console.log(user);
    //
    //
    //    return res.render("index",{messages: messages, user})
    //}
    //return res.render("index",{messages: messages, user: null})
    //// render messages and btns to login/register
    // res.send("in index route")
    res.render("index", { username: req.user?.username })
  },
  logout(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    })
  },
  upload: [
    upload.single('uploaded_file'),
    async (req, res, next) => {
      console.log(req.file)

      //set name to input or original
      //set url to file path
      //
      const finishedFile = await prisma.file.create({
        data:{
          name: req.body.file_name || req.file.originalname,
          url: req.file.path,
          userId: req.user.id,
          folderId: null
        }
      })
      console.log(finishedFile)
      res.redirect('/')
    }]
}
