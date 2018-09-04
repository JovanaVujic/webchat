const socket = require('socket.io');
const isEmpty = require('./validation/is-empty');

module.exports = io => {
  // Set socket.io listeners.
  let numUsers = 0;

  io.on('connection', socket => {
    // when the client emits 'add user', this listens and executes
    socket.on('login', username => {
      socket.broadcast.emit('user joined', {
        username
      });
    });

    // when the client emits 'new message', this listens and executes
    socket.on('new message', chat => {
      let chatVer1 = chat.to.name + chat.from.user.name;
      let chatVer2 = chat.from.user.name + chat.to.name;
      let room = null;
      //check if room user1user2 exists
      if (socket.adapter.rooms[chatVer1]) {
        room = chatVer1;
      }
      //check if room user2user1 exists
      if (socket.adapter.rooms[chatVer2]) {
        room = chatVer2;
      }

      if (room) {
        //send typing message to room
        socket.to(room).emit('refresh message', chat);
      }
    });

    // On conversation entry, join broadcast channel
    socket.on('join chat', chatroom => {
      let chatVer1 = chatroom.user1 + chatroom.user2;
      let chatVer2 = chatroom.user2 + chatroom.user1;

      //check if room exists between user1 and user2
      //if not create roomm with name user1user2
      if (!socket.adapter.rooms[chatVer1] && !socket.adapter.rooms[chatVer2]) {
        socket.join(chatVer1);
      } else {
        //join if room with name user1user2 exists
        if (socket.adapter.rooms[chatVer1] && !socket.adapter.rooms[chatVer2]) {
          socket.join(chatVer1);
        }
        //join if room with name user2user1 exists
        if (!socket.adapter.rooms[chatVer1] && socket.adapter.rooms[chatVer2]) {
          socket.join(chatVer2);
        }
      }
    });

    socket.on('leave chat', chatroom => {
      //chat name could be the combination of user1 and user1
      let chatVer1 = chatroom.user1 + chatroom.user2;
      let chatVer2 = chatroom.user2 + chatroom.user1;

      //leave chat room user1user2 if exists
      if (socket.adapter.rooms[chatVer1]) {
        socket.leave(chatVer2);
      }

      //leave chat room user2user1 if exists
      if (socket.adapter.rooms[chatVer2]) {
        socket.leave(chatVer2);
      }
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', chat => {
      let chatroom = chat.chatroom;

      if (isEmpty(chatroom)) return;
      let chatVer1 = chatroom.user1 + chatroom.user2;
      let chatVer2 = chatroom.user2 + chatroom.user1;
      let room = null;
      //check if room user1user2 exists
      if (socket.adapter.rooms[chatVer1]) {
        room = chatVer1;
      }
      //check if room user2user1 exists
      if (socket.adapter.rooms[chatVer2]) {
        room = chatVer2;
      }
      if (room) {
        //send typing message to room
        socket.to(room).emit('typing', chat.username + ' is typing...');
      }
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', chatroom => {
      if (isEmpty(chatroom)) return;
      let chatVer1 = chatroom.user1 + chatroom.user2;
      let chatVer2 = chatroom.user2 + chatroom.user1;
      let room = null;

      //check if room user1user2 exists
      if (socket.adapter.rooms[chatVer1]) {
        room = chatVer1;
      }
      //check if room user2user1 exists
      if (socket.adapter.rooms[chatVer2]) {
        room = chatVer2;
      }

      if (room) {
        //remove typing message
        socket.to(room).emit('stop typing');
      }
    });

    socket.on('logout', username => {
      // globally that this client has left
      socket.broadcast.emit('user left', {
        username: username
      });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {});
  });
};
