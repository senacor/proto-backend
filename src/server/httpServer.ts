import { Express, Request, Response } from 'express';

import { HttpHandler } from '../logic/httpHandler';
import { HttpHandlerResult } from '../types';
import * as express from 'express';
import * as cors from "cors";

const logRequest = (request: Request) => {
  console.log(`Received a ${request.method} request to ${request.path} with body ${JSON.stringify(request.body)}`);
};

const sendResponse = (result: HttpHandlerResult, response: Response) => {
  console.log(`Responding with code ${result.statusCode} and body: ${JSON.stringify(result.body)}`);
  response.status(result.statusCode).send(result.body);
};

export const createHttpServer = async (app: Express, port: number = 8998) => {
  app.use(express.json())
  app.use(cors())
  const handler = new HttpHandler();

  app.get('/*', (request, response) => {
    logRequest(request);
    const result = handler.handleGet(request);
    sendResponse(result, response);
  });

  app.put('/*', (request, response) => {
    logRequest(request);
    const result = handler.handlePut(request);
    sendResponse(result, response);
  });

  app.listen(port, () => {
    console.log(`HTTP Server started on port ${port}.`);
  });
};