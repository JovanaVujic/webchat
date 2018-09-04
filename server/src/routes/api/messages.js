const express = require('express');
const router = express.Router();
const passport = require('passport');

//Load input validation
const chatValidation = require('../../validation/chat');

// Load models
const Chat = require('../../models/Chat');
const Message = require('../../models/Message');

// @route   GET api/messages/chat/:chat_id
// @desc    chat history route
// @access  Private
router.get('/chat/:chat_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Find all messages by chat_id sorted by date
  Message.find({ chat: req.params.chat_id })
    .sort({ date: -1 })
    .populate('sender', ['name', 'avatar'])
    .then(messages => {
      if (!messages) {
        return res.status(404).json({ error: 'There are no messages' });
      }

      res.json(messages);
    })
    .catch(err => res.status(400).json(err));
});

// @route   GET api/messages/history/:recipient_id
// @desc    Get chat history by users
// @access  Private
router.get('/history/:recipient_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Find chat wher current user and recipient are participants
  Chat.findOne({
    $or: [
      { participants: [req.params.recipient_id, req.user.id] },
      { participants: [req.user.id, req.params.recipient_id] }
    ]
  }).then(chat => {
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    //Get messages from chat, sort by date
    Message.find({ chat: chat._id })
      .sort('-date')
      .populate('sender', ['name', 'avatar'])
      .then(messages => res.json(messages))
      .catch(err => res.json(err));
  });
});

// @route   GET api/messages/all
// @desc    Get last message from each chat
// @access  Private
router.get('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Find all chats for current user
  Chat.find({ participants: [req.user.id] })
    .then(chats => {
      if (!chats) {
        return res.status(404).json({ error: 'Chats not found' });
      }

      // let messages = [];
      chats.map(chat => {
        Message.find({ chat: chat._id })
          .sort('-date')
          .populate('sender', ['name', 'avatar'])
          .limit(1)
          .then(message => {
            res.json(message);
          })
          .catch(err => res.json(err));
      });
    })
    .catch(err => res.json(err));
});

// @route   POST api/messages/to/:recipient_id
// @desc    Create new message
// @access  Private
router.post('/to/:recipient_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  req.body.recipient = req.params.recipient_id;

  const { errors, isValid } = chatValidation(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Find chat for current user and recipient
  Chat.findOne({
    $or: [
      { participants: [req.user.id, req.params.recipient_id] },
      { participants: [req.params.recipient_id, req.user.id] }
    ]
  }).then(chat => {
    if (!chat) {
      //If chat wasn`t find, create new chat and insert message
      new Chat({
        participants: [req.user.id, req.params.recipient_id]
      })
        .save()
        .then(chat =>
          //Create message for chat
          new Message({
            chat: chat._id,
            text: req.body.text,
            sender: req.user
          })
            .save()
            .then(message => res.json(message))
        );
    } else {
      //Add new message in existing chat
      new Message({
        chat: chat._id,
        text: req.body.text,
        sender: req.user
      })
        .save()
        .then(message => res.json(message));
    }
  });
});

// @route   POST api/messages/chat/:chat_id
// @desc    create new message for chat
// @access  Private
router.post('/chat/:chat_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Create message for chat_id
  new Message({
    chat: req.params.chat_id,
    text: req.body.text,
    sender: req.user.id
  })
    .save()
    .then(message => res.json(message))
    .catch(err => res.status(400).json(err));
});

// @route   DELETE api/messages/chat/:chat_id
// @desc    Delete chat
// @access  Private
router.delete('/chat/:chat_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Chat.findOneAndRemove({
    $and: [{ _id: req.params.chat_id }, { participants: req.user.id }]
  }).then(() => res.json({ success: true }));
});

// @route   EDIT api/messages/:message_id
// @desc    Update message
// @access  Private
router.post('/:message_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Find my message by message id
  Message.findOneAndUpdate(
    {
      $and: [{ _id: req.params.message_id }, { author: req.user.id }]
    },
    { $set: { text: req.body.text } },
    { new: true }
  )
    .then(message => res.json(message))
    .catch(err => res.json(err));
});

module.exports = router;
