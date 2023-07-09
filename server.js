const express = require('express');
const { PORT, DATABASE_URL } = require('./config');
const logger = require('./logger');
const router = require('./server/router/routes');
const Database = require('./server/database');

const userManagementServer = express();
userManagementServer.use(express.json());
userManagementServer.use('/', router);

const start = async () => {
  try {
    const db = new Database(DATABASE_URL);
    await db.connect();
    const server = userManagementServer.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}.`);
    });

    const stopServer = async (type) => {
      logger.info(`HTTP server closed by ${type}.`);
      await db.disconnect();
      server.close();
      process.exit(0);
    };

    process.once('SIGINT', () => stopServer('SIGINT'));
    process.once('SIGTERM', () => stopServer('SIGTERM'));
  } catch (e) {
    logger.error(e);
  }
};

start().catch((error) => logger.error(error));
