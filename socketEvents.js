const socket = require('socket.io');
const ent = require('ent');

module.exports = io => {
  // Set socket.io listeners.
  io.on('connection', socket => {
    console.log('user connected');

    socket.on('join_chat', chat => {
      socket.join(chat);
      console.log('joined ' + chat);
    });

    socket.on('leave_chat', chat => {
      socket.leave(chat);
      console.log('left ' + chat);
    });

    socket.on('new_message', data => {
      io.sockets.in(data.room).emit('refresh_messages', data.text);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
