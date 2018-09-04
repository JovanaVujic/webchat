const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load configuration
const keys = require('../../config/keys');

// Load Input Validation
const signupValidation = require('../../validation/signup');
const loginValidation = require('../../validation/login');

// Load model
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   POST api/users/signup
// @desc    User signup method
// @access  Public
router.post('/signup', (req, res) => {
  const { errors, isValid } = signupValidation(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Find user by name
  User.findOne({ name: req.body.name }).then(user => {
    if (user) {
      errors.name = 'Name already exists';
      return res.status(400).json(errors);
    } else {
      //If username does not exist, create new user
      const newUser = new User({
        name: req.body.name,
        password: req.body.password
      });

      //Encrypt password using hash and salt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          //Set hash password and sava user
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              //Create empty profile for this user
              new Profile({
                user: user.id
              })
                .save()
                .then(profile => res.json(user))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = loginValidation(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const name = req.body.name;
  const password = req.body.password;

  // Find user by name
  User.findOne({ name }).then(user => {
    // Check for user
    if (!user) {
      errors.name = 'User not found';
      return res.status(404).json(errors);
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          status: user.status,
          isOnline: true
        }; // Create JWT Payload

        // Sign Token
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          user.isOnline = true;
          user.save().then(user => {
            res.json({
              success: true,
              token: keys.token + token
            });
          });
        });
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    avatar: req.avatar,
    isOnline: req.isOnline
  });
});

// @route   GET api/users/logout
// @desc    Logout User
// @access  Public
router.post('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate({ _id: req.user.id }, { $set: { isOnline: false } }, { new: true })
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

module.exports = router;
