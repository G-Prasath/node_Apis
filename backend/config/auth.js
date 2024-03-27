const jwt = require('jsonwebtoken');

const jwtSecret = '';

const jwtSecretEnv = process.env.JWT_SECRET;

if (jwtSecretEnv) {
  let jwtSecret = jwtSecretEnv;
}

const jwtOptions = {
  expiresIn: '1h',
};

const config = {
  jwt: {
    secret: jwtSecret,
    options: jwtOptions,
  },
};

module.exports = config;
