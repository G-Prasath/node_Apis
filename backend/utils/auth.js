const bcrypt = require('bcryptjs');

// Hash a password
exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(password, salt);
};

// Compare a password to the hash
exports.comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
