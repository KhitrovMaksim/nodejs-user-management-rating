const DATABASE_USER = process.env.NODEJS_USER_MANAGEMENT_DB_USER;
const DATABASE_PASSWORD = process.env.NODEJS_USER_MANAGEMENT_DB_PASSWORD;
const DATABASE_NAME = 'user-management';

module.exports = {
  DATABASE_URL: `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@nodejs.pa7mngq.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`,
  PRETTY_LOGGING: process.env.PRETTY_LOGGING,
  PORT: 5000,
  SECRET: 'secret key for jwt',
};
