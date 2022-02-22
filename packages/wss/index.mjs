// import express from 'express';
// import { WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';

// const server = express();

// server.listen(PORT, HOST, function () {
//   const { address, port } = this.address();
//   console.info('Listening on');
//   console.info('http://%s:%s', address, port);
//   console.info('wss://%s:%s', address, port);

//   const wssHumidity = new WebSocketServer({ server: this, path: '/humidity' });
//   const wssTemp = new WebSocketServer({ server: this, path: '/temperature' });

//   wssHumidity.on('connection', (ws) => {
//     setInterval(() => {
//       const payload = {
//         entity: 'humidity',
//         id: nanoid(),
//         value: Math.random(),
//         time: new Date().toISOString(),
//       };
//       ws.send(JSON.stringify(payload));
//     }, 1000);
//   });

//   wssTemp.on('connection', (ws) => {
//     setInterval(() => {
//       const payload = {
//         entity: 'temperature',
//         id: nanoid(),
//         value: Math.random(),
//         time: new Date().toISOString(),
//       };
//       ws.send(JSON.stringify(payload));
//     }, 1000);
//   });
// });

// // import { WebSocketServer } from 'ws';

// // const wss = new WebSocketServer({ port: 5000 });

// // wss.on('connection', function connection(ws) {
// //   ws.on('message', function message(data) {
// //     console.log('received: %s', data);
// //   });

// //   ws.send('something');
// // });

import express from 'express';
import ExpressWs from 'express-ws';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

const app = express();
ExpressWs(app);

app.get('/', function (_req, res, _next) {
  res.send(204).end();
});

app.ws('/humidity', function (ws, _req) {
  setInterval(() => {
    const payload = {
      entity: 'humidity',
      id: nanoid(),
      value: Math.random(),
      time: new Date().toISOString(),
    };
    ws.send(JSON.stringify(payload));
  }, 200);
});

app.ws('/temperature', function (ws, _req) {
  setInterval(() => {
    const payload = {
      entity: 'temperature',
      id: nanoid(),
      value: (Math.random() + 3) * 10,
      time: new Date().toISOString(),
    };
    ws.send(JSON.stringify(payload));
  }, 200);
});

app.listen(PORT, HOST, function () {
  const { address, port } = this.address();
  console.info('Listening on');
  console.info('http://%s:%s', address, port);
  console.info('wss://%s:%s', address, port);
});
