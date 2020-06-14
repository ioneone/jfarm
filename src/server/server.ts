const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);

const io = socketIO.listen(server);

const players = {};

app.use(express.static(path.join( __dirname, "../client")))

app.get('/', (req, res) => {
  res.sendFile(path.resolve("./src/client/index.html"));
});

io.on('connection', (socket) => {

  console.log('A use connected: ', socket.id);

  players[socket.id] = {
    x: 100,
    y: 100,
    id: socket.id
  };

  // send the players object to the new socket
  socket.emit('CurrentPlayers', players);

  // send the new player object to all the other sockets
  socket.broadcast.emit('NewPlayer', players[socket.id]);

  // when a player disconnects, remove them from players
  socket.on('disconnect', () => {

    console.log('user disconnected: ', socket.id);
    
    delete players[socket.id];

    // emit a message to all sockets to remove this player
    io.emit('disconnect', socket.id);

  });

  // when a player moves update the player data
  socket.on('PlayerMovement', (movementData) => {
    players[socket.id].velocityX = movementData.velocityX;
    players[socket.id].velocityY = movementData.velocityY;

    // emit a message to all the other sockets that this player has moved
    socket.broadcast.emit('PlayerMoved', players[socket.id]);
  })
});

server.listen(8000, () => {
  console.log(`Listening on ${server.address().port}`);
});