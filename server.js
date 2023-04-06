

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let countSubscribers = 0;
let lastUpdatedAt = new Date().toISOString();

function sendErrorMessage(ws) {
  const error = {
    type: "Error",
    error: "Requested method not implemented",
    updatedAt: new Date().toISOString()
  };
  ws.send(JSON.stringify(error));
}

function sendHeartbeat(ws) {
  const heartbeat = {
    type: "Heartbeat",
    updatedAt: new Date().toISOString()
  };
  ws.send(JSON.stringify(heartbeat));
}

wss.on('connection', function connection(ws) {
  console.log('New connection received');

  ws.on('message', function incoming(message) {
    console.log(`Received message: ${message}`);

    try {
      const request = JSON.parse(message);

      switch (request.type) {
        case "Subscribe":
          const subscribed = {
            type: "Subscribe",
            status: "Subscribed",
            updatedAt: new Date().toISOString()
          };
          setTimeout(() => {
            ws.send(JSON.stringify(subscribed));
          }, 4000);
          break;
        case "Unsubscribe":
          const unsubscribed = {
            type: "Unsubscribe",
            status: "Unsubscribed",
            updatedAt: new Date().toISOString()
          };
          setTimeout(() => {
            ws.send(JSON.stringify(unsubscribed));
          }, 8000);
          break;
        case "CountSubscribers":
          const count = {
            type: "CountSubscribers",
            count: countSubscribers,
            updatedAt: new Date().toISOString()
          };
          ws.send(JSON.stringify(count));
          break;
        default:
          sendErrorMessage(ws);
          break;
      }
    } catch (error) {
      const badFormattedPayloadError = {
        type: "Error",
        error: "Bad formatted payload, non JSON",
        updatedAt: new Date().toISOString()
      };
      ws.send(JSON.stringify(badFormattedPayloadError));
    }
  });

  const heartbeatInterval = setInterval(() => {
    sendHeartbeat(ws);
  }, 1000);

  ws.on('close', function close() {
    clearInterval(heartbeatInterval);
    console.log('Connection closed');
  });
});