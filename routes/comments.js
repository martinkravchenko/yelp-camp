"use strict"

const
    express = require('express'),
    router = express.Router({ mergeParams: true }),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware')

// NEW - show form to create a new comment
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            console.log(err)
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            res.render('comments/new', { campground })
        }
    })
})

// POST - add new comment to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            console.log(err)
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err || !comment) {
                    console.log(err)
                    req.flash('error', "An error occured!")
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // Save comment
                    comment.save()
                    campground.comments.push(comment._id)
                    campground.save()
                    req.flash('success', "Comment successfully created!")
                    res.redirect(`/campgrounds/${req.params.id}`)
                }
            })
        }
    })
})

// EDIT - show form to edit a comment
router.get('/:comment_id/edit', middleware.checkCommentsOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err || !comment) {
            console.log(err)
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            res.render('comments/edit', { campground_id: req.params.id, comment })
        }
    })
})

// UPDATE - update a comment in the DB
router.put('/:comment_id', middleware.checkCommentsOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            console.log(err)
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
                if (err || !comment) {
                    console.log(err)
                    req.flash('error', "An error occured!")
                    res.redirect('back')
                } else {
                    req.flash('success', "Comment successfully updated!")
                    res.redirect('/campgrounds/' + req.params.id)
                }
            })
        }
    })
})

// DESTROY - delete a comment
router.delete('/:comment_id', middleware.checkCommentsOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
        if (err || !comment) {
            console.log(err)
            req.flash('error', "An error occured!")
            res.redirect('back')
        } else {
            req.flash('success', "Comment successfully deleted!")
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

module.exports = router
