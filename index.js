const express = require('express');
const app = express();
const server = require('http').Server(app);
const client = require('socket.io')(server);

//required files
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));

// open chat room
app.get('/:room', (req, res) => {
  res.sendFile('./public/views/chat.html', { root: __dirname });
});

server.listen(3000);

client.on('connection', (socket) => {
  // save user console.log(socket.handshake.query.user);
  const user = socket.handshake.query.user;
  const room = socket.handshake.query.room;

  // join room
  socket.join(room);
  console.log(`subscribe ${user} to ${room}`);

  // broadcat hello message
  socket.to(room).broadcast.emit('chat-message', `${user} joined chat`);

  // react to ne messages
  socket.on('new-message', (msg) => {
    console.log(msg, room);
    socket.to(room).emit('chat-message', msg);
  });
});

var count = 0;

setInterval(() => {
  count++;
  client.emit('hearthbeat', count);
}, 1000);
