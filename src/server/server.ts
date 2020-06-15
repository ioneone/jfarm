import express from 'express';
import http from 'http';
import path from 'path';
import SocketIO from 'socket.io';
import { AddressInfo } from 'net';
import { Event, EventData } from '../client/events/Event';

const app = express();
const server = new http.Server(app);

const io = SocketIO.listen(server);

const players = {};

app.use(express.static(path.join( __dirname, "../client")))

app.get('/', (req, res) => {
  res.sendFile(path.resolve("./src/client/index.html"));
});

io.on('connection', (socket) => {

  players[socket.id] = {
    level: 0,
    x: 0,
    y: 0,
    flipX: false,
    frameName: "",
    weaponAngle: 0,
    id: socket.id
  };

  // send the players object to the new socket
  socket.emit(Event.VisitGame, players);

  // send the new player object to all the other sockets
  socket.broadcast.emit(Event.NewPlayer, players[socket.id]);

  // when a player disconnects, remove them from players
  socket.on('disconnect', () => {

    delete players[socket.id];

    // emit a message to all sockets to remove this player
    io.emit('disconnect', socket.id);

  });

  // when a player moves update the player data
  socket.on(Event.PlayerMoved, (data) => {
    const movementData = data as EventData.PlayerMoved;
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].flipX = movementData.flipX;
    players[socket.id].frameName = movementData.frameName;
    players[socket.id].weaponAngle = movementData.weaponAngle;

    // emit a message to all the other sockets that this player has moved
    socket.broadcast.emit(Event.PlayerMoved, players[socket.id]);
  })
});

server.listen(8000, () => {
  console.log(`Listening on ${(server.address() as AddressInfo).port}`);
});