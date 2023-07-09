const logger = require('../../logger');
const tokenService = require('../service/token.service');

// eslint-disable-next-line consistent-return
module.exports = (roles) => (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const { role } = tokenService.validateToken(token);

    let hasRole = false;

    if (roles.includes(role)) {
      hasRole = true;
    }

    if (!hasRole) {
      return res.status(403).json({ message: `Access denied for role: ${role}` });
    }
    next();
  } catch (error) {
    logger.error(`Authorization error: ${error}`);
    return res.status(401).json({ message: 'Authorization error' });
  }
};
