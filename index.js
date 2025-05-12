
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.use(express.json());

// Store users and their phone numbers
const users = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('login', (phoneNumber) => {
    users.set(socket.id, phoneNumber);
    io.emit('user joined', `${phoneNumber} joined the chat`);
  });

  socket.on('chat message', (msg) => {
    const phoneNumber = users.get(socket.id);
    io.emit('chat message', { phoneNumber, message: msg });
  });

  socket.on('disconnect', () => {
    const phoneNumber = users.get(socket.id);
    if (phoneNumber) {
      io.emit('user left', `${phoneNumber} left the chat`);
      users.delete(socket.id);
    }
    console.log('User disconnected');
  });
});

http.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});
