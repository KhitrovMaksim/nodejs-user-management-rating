const jwt = require('jsonwebtoken');
const { SECRET } = require('../../config');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(
      payload,
      SECRET,
      {
        expiresIn: '24h',
      },
      null,
    );
    return accessToken;
  }

  validateToken(token) {
    try {
      return jwt.verify(token, SECRET, null, null);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
