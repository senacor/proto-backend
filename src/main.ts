import * as express from 'express';

import { createWsServer } from './server/wsServer';
import { createHttpServer } from './server/httpServer';

const app = express();
app.use(express.json({limit: '1mb'}));

// noinspection JSIgnoredPromiseFromCall
Promise.all([
  createHttpServer(app),
  createWsServer(app),
])