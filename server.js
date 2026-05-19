// server.js
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = {};

server.on('connection', (ws) => {
  const id = Math.random().toString(36).substr(2, 9);
  clients[id] = ws;
  ws.send(JSON.stringify({ type: 'id', id }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const to = data.to || null;

    if (data.type === 'join') {
      // Кто присоединился, разошлите всем
      for (const clientId in clients) {
        if (clientId !== id) {
          clients[clientId].send(JSON.stringify({ type: 'joined', id }));
        }
      }
    } else if (to && clients[to]) {
      clients[to].send(JSON.stringify({ ...data, from: id }));
    }
  });

  ws.on('close', () => {
    delete clients[id];
  });
});