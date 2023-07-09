const crypto = require('crypto');

const getHashedPassword = (password) => {
  const hashedPasswordBytes = crypto.pbkdf2Sync(password, 'salt', 6, 16, 'sha512');

  return hashedPasswordBytes.toString('hex');
};

module.exports = getHashedPassword;
