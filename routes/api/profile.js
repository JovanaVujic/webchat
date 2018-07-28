const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load models
const User = require("../../models/User");
const Profile = require("../../models/Profile");

const profileValidation = require("../../validation/profile");

const upload = require("../../utils/upload");

//GET requests

// @route GET /api/profile
// @desc GET profile for current user route
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name"])
      .then(profile => {
        if (!profile) {
          return res
            .status(404)
            .json({ errors: "There is no profile for this user" });
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.find({ user: { $ne: req.user.id } })
      .populate("user", ["name"])
      .then(profiles => {
        if (!profiles) {
          return res.status(404).json({ error: "There are no profiles" });
        }

        res.json(profiles);
      })
      .catch(err => res.status(404).json({ profile: "There are no profiles" }));
  }
);

//POST requests

// @route POST /api/profile
// @desc Create/Edit profile route
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.any(),
  (req, res) => {
    const profileData = {};

    req.files.map(file => {
      profileData.avatar = file.destination + file.filename;
    });

    profileData.user = req.user.id;
    if (req.body.status) profileData.status = req.body.status;

    const { errors, isValid } = profileValidation(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //Profile update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileData },
          { new: true }
        )
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
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
