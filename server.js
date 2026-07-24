const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });
console.log('Multiplayer WebSocket Relay Server started on port 3001');

// Keep track of connected clients
const clients = new Map();

wss.on('connection', function connection(ws, req) {
  // Simple room extraction from URL query parameter ?room=XYZ
  let room = 'default';
  const match = req.url.match(/room=([^&]+)/);
  if (match && match[1]) {
    room = match[1];
  }

  clients.set(ws, { room });

  console.log(`Client connected to room: ${room}`);

  ws.on('message', function incoming(message) {
    const sender = clients.get(ws);

    // Broadcast to everyone else in the same room
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const receiver = clients.get(client);
        if (receiver && receiver.room === sender.room) {
          client.send(message.toString());
        }
      }
    });
  });

  ws.on('close', () => {
    console.log(`Client disconnected from room: ${room}`);
    clients.delete(ws);
  });
});
