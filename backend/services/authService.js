const jwt = require('jsonwebtoken');
const AuthSchema = require('../models/Auth.models');

// Generate a JWT token
exports.generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '20m',
  });
};

// VerifyToken the user data from the token
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'Missing Token' })
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(403).json({ message: 'Invalid Token' })
      }
      const user = await AuthSchema.findOne({ _id: decode.id });
      if (!user) {
        return res.status(404).json({ message: 'No User Found with this token' })
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return null;
  }
};
