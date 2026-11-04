const ws = require('ws');
const url = require('url');

const PORT = 3001;
const wss = new ws.Server({ port: PORT });

console.log(`[Multiplayer Relay] SuperSaber relay listening on port ${PORT}...`);

const rooms = {};

wss.on('connection', (socket, req) => {
  const parsed = url.parse(req.url, true);
  const room = (parsed.query && parsed.query.room) || 'ROOM1';

  if (!rooms[room]) {
    rooms[room] = new Set();
  }
  rooms[room].add(socket);
  console.log(`[Multiplayer Relay] Client joined room '${room}'. Active in room: ${rooms[room].size}`);

  socket.on('message', (message) => {
    if (rooms[room]) {
      for (const client of rooms[room]) {
        if (client !== socket && client.readyState === 1 /* OPEN */) {
          client.send(message.toString());
        }
      }
    }
  });

  socket.on('close', () => {
    if (rooms[room]) {
      rooms[room].delete(socket);
      console.log(`[Multiplayer Relay] Client left room '${room}'. Active in room: ${rooms[room].size}`);
      if (rooms[room].size === 0) {
        delete rooms[room];
      }
    }
  });

  socket.on('error', (err) => {
    console.warn(`[Multiplayer Relay] Socket error: ${err.message}`);
  });
});
