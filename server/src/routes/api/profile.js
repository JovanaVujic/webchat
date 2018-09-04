const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// Load Input Validation
const profileValidation = require('../../validation/profile');

//Load upload servise
const upload = require('../../utils/upload');

//GET requests

// @route GET /api/profile
// @desc GET profile for current user route
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  //Find profile for  current user
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'isOnline'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Private
router.get('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  //Find all profile except for current user
  Profile.find({ user: { $ne: req.user.id } })
    .populate('user', ['name', 'isOnline'])
    .then(profiles => {
      if (!profiles) {
        errors.profile = 'There are no profiles';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => {
      errors.profile = 'There are no profiles';
      return res.status(404).json(errors);
    });
});

//POST requests

// @route POST /api/profile
// @desc Create/Edit profile route
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), upload.any(), (req, res) => {
  const profileData = {};

  profileData.user = req.user.id;

  //get uploaded file name
  req.files.map(file => (profileData.avatar = '/uploads/avatar/' + file.filename));

  if (req.body.status) profileData.status = req.body.status;

  const { errors, isValid } = profileValidation(profileData);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Find profile by current user
  Profile.findOne({ user: req.user.id }).then(profile => {
    if (profile) {
      //Profile update
      Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileData }, { new: true })
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    } else {
      //Profile create
      new Profile(profileData)
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err));
    }
  });
});

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }));
  });
});

module.exports = router;
