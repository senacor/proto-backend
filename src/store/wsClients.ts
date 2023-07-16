import { WebSocket } from 'ws';
import { WebSocketWithId } from '../types';

const clients: Record<string, WebSocket> = {};

export const getClient = (clientId: string): WebSocketWithId => {
  return {
    clientId,
    socket: clients[clientId],
  };
}

export const removeClient = (clientId: string) => delete clients[clientId]

export const writeClient = (webSocket: WebSocketWithId) => clients[webSocket.clientId] = webSocket.socket;