"use strict"
const
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    seedDB = require('./seeds'),
    methodOverride = require('method-override'),
    flash = require('connect-flash')

// Models
const
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user')

// Routes
const
    indexRoutes = require('./routes/index'),
    campgroundsRoutes = require('./routes/campgrounds'),
    commentsRoutes = require('./routes/comments')

mongoose.connect(process.env.DATABASEURL)
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", 'ejs')
app.use(express.static(`${__dirname}/public`))
app.use(methodOverride('_method'))
app.use(flash())
// seedDB()

app.use(require('express-session')({
    secret: "The quick brown fox jumps over the lazy dog.",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.flashError = req.flash('error')
    res.locals.flashSuccess = req.flash('success')
    next()
})

// Configuring routes
app.use('/', indexRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/comments', commentsRoutes)

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server started on https://webdevbootcamp-kravmart.c9users.io/")
})
