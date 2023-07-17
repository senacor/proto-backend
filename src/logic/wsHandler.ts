import { JsonNode, WebSocketWithId, WsInboundMessage, WsOutboundMessage, WsOutboundMessageType } from '../types';
import { storeSubscription, unsubscribeClient } from '../store/subscriptions';
import { removeClient, writeClient } from '../store/wsClients';
import { getFromStorage } from '../store/storage';

const objectToJsonString = (object: JsonNode): string => JSON.stringify(object, undefined, 1)
  .replace(/\n/g, ' ') // Replace all line breaks. We want a single line return item
  .replace(/\s+/g, ' ') // Reduce all whitespaces to one character.

export const sendWsMessage = (webSocket: WebSocketWithId, type: WsOutboundMessageType, message?: JsonNode) => {
  const wrappedMessage: WsOutboundMessage = {type, body: message, _clientId: webSocket.clientId};
  webSocket.socket.send(objectToJsonString(wrappedMessage));
};

export class WsHandler {
  private readonly webSocket: WebSocketWithId;

  constructor(webSocket: WebSocketWithId) {
    this.webSocket = webSocket;
  }

  public get clientId() {
    return this.webSocket.clientId;
  }

  public handleMessage = (message: string) => {
    try {
      this.handleMessageInternal(message);
    } catch (e) {
      console.error(e);
      this.sendMessage('ERROR', `${(e as Error).message}`);
    }
  };

  private handleMessageInternal = (message: string) => {
    console.log('Received: %s', message);
    const parsed_message: WsInboundMessage = JSON.parse(message);

    switch (parsed_message.type) {
      case 'PING':
        this.sendMessage('PONG');
        break;
      case 'SUBSCRIPTION':
        this.handleSubscription(parsed_message);
        break;
      default:
        // noinspection ExceptionCaughtLocallyJS
        throw Error(`Unknown type: ${parsed_message.type}`);
    }
  };

  private handleSubscription = (parsed_message: WsInboundMessage) => {
    if (!parsed_message.body || parsed_message.body.indexOf('/') >= 0) {
      this.sendMessage('ERROR', `SUBSCRIPTION Requests need a body string that does not contain a '/' character`);
      return;
    }

    const subscriptionPath: string = parsed_message.body;
    storeSubscription(this.clientId, subscriptionPath);
    console.log(`Subscribed client with id ${this.clientId} to path ${subscriptionPath}`);
    this.sendMessage('SUBSCRIPTION_ESTABLISHED', getFromStorage([subscriptionPath]));
  };

  public handleClose = () => {
    unsubscribeClient(this.clientId);
    removeClient(this.clientId);
    console.log(`Closed connection to client with id ${this.clientId}`);
  };

  public handleConnect = () => {
    writeClient(this.webSocket);
    console.log(`Established connection to client with id ${this.clientId}`);
    this.sendMessage('CONNECTION_ESTABLISHED');
  };

  private sendMessage = (type: WsOutboundMessageType, message?: JsonNode) => {
    sendWsMessage(this.webSocket, type, message);
  };
}