"use strict"

const
    express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user')

// Homepage
router.get('/', (req, res) => {
    res.render('landing')
})

// Show register form
router.get('/register', (req, res) => {
    res.render('register')
})

// Register user
router.post('/register', (req, res) => {
    let newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err || !user) {
            console.log(err)
            req.flash('error', err.message)
            return res.redirect('/register')
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', "Welcome to YelpCamp " + user.username)
            res.redirect('/campgrounds')
        })
    })
})

// Show login form
router.get('/login', (req, res) => {
    res.render('login')
})

// Login user
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {})

// Logout user
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', "Logged out!")
    res.redirect('/campgrounds')
})

module.exports = router
