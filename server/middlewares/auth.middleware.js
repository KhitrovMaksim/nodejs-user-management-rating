const logger = require('../../logger');
const tokenService = require('../service/token.service');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Authorization error' })[1];
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token not exist' });
    }

    const userData = tokenService.validateToken(token);
    if (!userData) {
      return res.status(401).json({ message: 'Token validation error' });
    }

    req.user = userData;
    next();
  } catch (error) {
    logger.error(`Authorization error: ${error}`);
    return res.status(401).json({ message: 'Authorization error' });
  }
};
