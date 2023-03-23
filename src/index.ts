/* eslint-disable import/first */
import 'reflect-metadata';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { Application } from 'express';
import config from 'config';
import { DEFAULT_SERVER_PORT } from './common/constants';

dotenv.config({ path: __dirname + '/config/.env' });
import { getApp } from './app';

const port: number = config.get<number>('server.port') || DEFAULT_SERVER_PORT;

void getApp()
  .then((app: Application) => {
    const server = createServer(app);
    server.listen(port, () => {
      console.log(`app started on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('😢 - failed initializing the server');
    console.error(error.message);
  });

