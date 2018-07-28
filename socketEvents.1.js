const socket = require('socket.io');
const ent = require('ent');

module.exports = io => {
  // Set socket.io listeners.
  io.on('connection', socket => {
    socket.send(
      JSON.stringify({
        type: 'serverMessage',
        message:
          'Send message from server to client. Welcome to the most interesting chat room on earth!'
      })
    );

    socket.on('new_client', name => {
      name = ent.encode(name);
      socket.name = name;
      socket.broadcast.emit('new_client', name);
    });

    socket.on('message', message => {
      console.log('I received a message', message);
      message = ent.encode(message);
      if (message.type == 'userMessage') {
        socket.broadcast.send(ent.encode(message));
        message.type = 'myMessage';
        socket.send(JSON.stringify(message));
      }
    });
    // On conversation entry, join broadcast channel
    socket.on('enter chat', chat => {
      socket.join(chat);
      console.log('joined ' + chat);
    });

    socket.on('leave chat', chat => {
      socket.leave(chat);
      console.log('left ' + chat);
    });

    socket.on('new message', chat => {
      io.sockets.in(chat).emit('refresh messages', chat);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
