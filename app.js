const express = require("express")
const app = express()

const passport = require("passport")

const expressSession = require('express-session')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}))
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

require('./config/passport'); // Ensure this is before app.use(passport.initialize())
app.use(passport.initialize());
app.use(passport.session());


// ROUTE IMPORTS

const indexRoute = require('./routes/index')
const userRoute = require('./routes/user')

// ROUTES
app.use((req,res,next) => {
  console.log(req.session)
  console.log(req.user)
  next()
})
app.use('/',indexRoute)
app.use('/user', userRoute)

//app.get("/", (req,res,next)=>{res.send("HOOIIII")})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}!`)
})

//accounts
//  auth
//  db
//
//file storeage
//  db setup
//    personalized folder structure
//
