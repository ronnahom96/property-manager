import { Db } from 'mongodb';
import { connect } from 'mongoose';
import { logger } from './logger';

export default async (connectionUrl: string): Promise<Db> => {
  logger.debug("try to connect db");
  const connection = await connect(connectionUrl);
  logger.debug("successfully connected")
  return connection.connection.db;
};
