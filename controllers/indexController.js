
//const db = require('../db/pool')
const {body, validationResult} = require('express-validator')
//const { genHash } = require('../lib/passwordUtils')
const passport = require('passport');

module.exports = {
    async index(req, res, next){
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
        res.send("in index route")
    },
}
