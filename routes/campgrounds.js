"use strict"

const
    express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware')

// INDEX - show all campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err || !campgrounds) {
            console.log('Error')
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            res.render('campgrounds/index', { campgrounds })
        }
    })
})

// NEW - show form to create a campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new.ejs')
})

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        price: req.body.price,
        author: { id: req.user._id, username: req.user.username }
    }, (err, campground) => {
        if (err || !campground) {
            console.log('Error')
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            req.flash('success', "Campground successfully created!")
            res.redirect('/campgrounds')
        }
    })
})

// SHOW - shows more info about a campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
        if (err || !campground) {
            console.log(err)
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            res.render('campgrounds/show', { campground })
        }
    })
})

// EDIT - show form to edit a campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            console.log(err)
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            res.render('campgrounds/edit', { campground })
        }
    })
})

// UPDATE - update a campground in the DB
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if (err || !campground) {
            console.log(err)
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            req.flash('success', "Campground successfully updated!")
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DESTROY - delete a campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // Delete campground
    Campground.findByIdAndRemove(req.params.id, (err, campground) => {
        if (err || !campground) {
            console.log(err)
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            // Delete comments
            Comment.remove({ _id: { $in: campground.comments } }, (err, comment) => {
                if (err || !comment) {
                    console.log(err)
                    req.flash('error', "An error occured!")
                }
            })
            req.flash('success', "Campground successfully deleted!")
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router
