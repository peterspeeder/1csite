const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messages = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Send existing messages to the new user
  socket.emit('init', messages);

  // Listen for new messages
  socket.on('message', (message) => {
    messages.push(message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
