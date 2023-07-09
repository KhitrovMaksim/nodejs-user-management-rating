const { default: mongoose } = require('mongoose');
const logger = require('../logger');

class Database {
  constructor(url) {
    mongoose.set('strictQuery', false);
    this.url = url;
  }

  async connect() {
    await mongoose.connect(
      this.url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => logger.info('The connection to the database established.'),
    );
  }

  async disconnect() {
    await mongoose.connection.close();
    logger.info('The connection to the database has been terminated.');
  }
}

module.exports = Database;
