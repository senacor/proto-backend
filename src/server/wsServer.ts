import { Express } from 'express';
import { createServer } from 'http';
import { v4 as uuid } from 'uuid';
import { AddressInfo, Server, WebSocket } from 'ws';
import { WsHandler } from '../logic/wsHandler';

export const createWsServer = async (app: Express, port: number = 8999) => {
  const server = createServer(app);
  const webSocketServer = new Server({server: server});

  webSocketServer.on('connection', (webSocket: WebSocket) => {
    const clientId = uuid();
    const handler = new WsHandler({clientId, socket: webSocket})

    webSocket.on('message', handler.handleMessage);
    webSocket.on('close', handler.handleClose);

    handler.handleConnect()
  });

  server.listen(port, () => {
    console.log(`WS Server started on port ${(server.address() as AddressInfo).port}.`);
  });
};