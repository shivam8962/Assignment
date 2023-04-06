const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8080');

socket.on('message', (message) => {
  console.log(`Message Received: ${message}`);
});

socket.on('open', () => {
  console.log('Connected');

  // Send some test requests to the server
  setTimeout(() => {
    sendRequest('Subscribe');
  }, 1000);

  setTimeout(() => {
    sendRequest('Subscribe');
  }, 2000);

  setTimeout(() => {
    sendRequest('CountSubscribers');
  }, 5000);

  setTimeout(() => {
    sendRequest('Unsubscribe');
  }, 10000);

  setTimeout(() => {
    sendRequest('Unsubscribe');
  }, 15000);

  setTimeout(() => {
    sendRequest('Unknown');
  }, 20000);

  function sendRequest(type) {
    const message = { type };
    socket.send(JSON.stringify(message));
  }
});
