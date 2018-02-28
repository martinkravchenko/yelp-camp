"use strict"

const
    Campground = require('../models/campground'),
    Comment = require('../models/comment')

module.exports = {
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error', "You need to be logged in to do that!")
        res.redirect('/login')
    },
    checkCampgroundOwnership: function(req, res, next) {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, campground) => {
                if (err || !campground) {
                    console.log(err)
                    req.flash('error', "An error occured, please try again!")
                    res.redirect('back')
                } else {
                    if (campground.author.id.equals(req.user._id)) {
                        next()
                    } else {
                        req.flash('error', "You don't have permission to do that!")
                        res.redirect('back')
                    }
                }
            })
        } else {
            req.flash('error', "You need to be logged in to do that!")
            res.redirect('back')
        }
    },
    checkCommentsOwnership: function(req, res, next) {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, comment) => {
                if (err || !comment) {
                    console.log(err)
                    req.flash('error', "An error occured!")
                    res.redirect('back')
                } else {
                    if (comment.author.id.equals(req.user._id)) {
                        next()
                    } else {
                        req.flash('error', "You don't have permission to do that!")
                        res.redirect('back')
                    }
                }
            })
        } else {
            req.flash('error', "You need to be logged in to do that!")
            res.redirect('back')
        }
    }
}
