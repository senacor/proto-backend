import { getFromStorage, writeToStorage } from '../store/storage';
import { getClient } from '../store/wsClients';
import { getSubscribedClientIds } from '../store/subscriptions';
import { HttpHandlerResult, JsonNode, JsonObject } from '../types';
import { Request } from 'express';
import { splitPath } from './pathSplitter';
import { sendWsMessage } from './wsHandler';

export class HttpHandler {
  public handleGet = (request: Request): HttpHandlerResult => {
    const storagePath = splitPath(request.path)

    return {body: getFromStorage(storagePath), statusCode: 200}
  }

  public handlePut = (request: Request): HttpHandlerResult => {
    const storagePath = splitPath(request.path)
    const content: JsonNode = request.body

    const result = writeToStorage(storagePath, content)

    this.notifySubscribers(storagePath)

    return {body: result, statusCode: 200}
  }

  private notifySubscribers = (storagePath: Array<string>) => {
    const storagePathRoot = storagePath[0];
    const message = {[storagePathRoot]: getFromStorage([storagePathRoot])};

    const subscribedClients = getSubscribedClientIds(storagePathRoot).map(clientId => getClient(clientId));

    if (subscribedClients.length > 0) {
      console.log(`Notifying ${subscribedClients.length} subscribers of updated root element ${storagePathRoot}. New value is: ${JSON.stringify(message)}`);
    }

    subscribedClients.forEach((client) => sendWsMessage(client, 'SUBSCRIPTION_UPDATE', message));
  };
}