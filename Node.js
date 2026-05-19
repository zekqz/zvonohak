const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Новый участник подключился');

  ws.on('message', (message) => {
    // Пересылаем сообщение всему, кроме отправителя
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Участник отключился');
  });
});

console.log('Сигнальный сервер запущен на порту 8080');
