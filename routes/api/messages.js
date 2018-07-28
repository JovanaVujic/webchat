const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load models
const User = require('../../models/User');
const Chat = require('../../models/Chat');
const Message = require('../../models/Message');

const chatValidation = require('../../validation/chat');

// @route   GET api/messages/chat/:chat_id
// @desc    chat history route
// @access  Private
router.get(
  '/chat/:chat_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Message.find({ chat: req.params.chat_id })
      .sort({ date: -1 })
      .populate('sender', ['name'])
      .then(messages => {
        if (!messages) {
          return res.status(404).json({ error: 'There are no messages' });
        }

        res.json(messages);
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   GET api/messages/all
// @desc    get last message from each chat
// @access  Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Chat.find({ participants: req.user.id })
      .then(chats => {
        if (!chats) {
          return res.status(404).json({ error: 'Chats not found' });

          let messages = [];
          chats.map(chat => {
            Message.find({ chat: chat._id })
              .sort({ date: -1 })
              .populate('user', ['name'])
              .limit(1)
              .then(message => {
                messages.push(message);
                return res.json({ messages: messages });
              })
              .catch(err => res.json(err));
          });
        }
      })
      .catch(err => res.json(err));
  }
);

// @route   POST api/messages/to/:recipient
// @desc    create new chat
// @access  Private
router.post(
  '/to/:recipient',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    req.body.recipient = req.params.recipient;
    const { errors, isValid } = chatValidation(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Chat.findOne({ participants: [req.user.id, req.params.recipient] })
      .then(chat => {
        if (!chat) {
          //create new chat
          new Chat({
            participants: [req.user.id, req.params.recipient]
          })
            .save()
            .then(chat =>
              new Message({
                chat: chat._id,
                text: req.body.text,
                sender: req.user.id
              })
                .save()
                .then(message => res.json(message))
                .catch(err => res.status(400).json(err))
            )
            .catch(err => res.status(400).json(err));
        } else {
          new Message({
            chat: chat._id,
            text: req.body.text,
            sender: req.user.id
          })
            .save()
            .then(message => res.json(message))
            .catch(err => res.status(400).json(err));
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST api/messages/chat/:chat_id
// @desc    create new message for chat
// @access  Private
router.post(
  '/chat/:chat_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    new Message({
      chat: req.params.chat_id,
      text: req.body.text,
      sender: req.user.id
    })
      .save()
      .then(message => res.json(message))
      .catch(err => res.status(400).json(err));
  }
);

// @route   DELETE api/messages/chat/:chat_id
// @desc    Delete chat
// @access  Private
router.delete(
  '/chat/:chat_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Chat.findOneAndRemove({
      $and: [{ _id: req.params.chat_id }, { participants: req.user.id }]
    }).then(() => res.json({ success: true }));
  }
);

// @route   EDIT api/messages/:message_id
// @desc    Update message
// @access  Private
router.post(
  '/:message_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Message.findOneAndUpdate(
      {
        $and: [{ _id: req.params.message_id }, { author: req.user.id }]
      },
      { $set: { text: req.body.text } },
      { new: true }
    )
      .then(message => res.json(message))
      .catch(err => res.json(err));
  }
);

module.exports = router;
