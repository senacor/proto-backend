import * as express from 'express';

import { createWsServer } from './server/wsServer';
import { createHttpServer } from './server/httpServer';

const app = express();

// noinspection JSIgnoredPromiseFromCall
Promise.all([
  createHttpServer(app),
  createWsServer(app),
])