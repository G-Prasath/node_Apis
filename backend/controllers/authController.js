const AuthSchema = require('../models/Auth.models.js');
const { hashPassword, comparePassword } = require('../utils/auth.js');
const { generateToken } = require('../services/authService');

const nodemailer = require('nodemailer');
const session = require('express-session');


/** Registration API */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const isExists = await AuthSchema.findOne({ email: email });

    if (!isExists) {
      const encPassword = await hashPassword(password);
      const newUser = new AuthSchema({ name, email, password: encPassword });
      await newUser.save();
      return res.status(201).json({ message: 'User saved successfully' })
    }
    else {
      res.status(403).json({ message: 'user already exists' })
    }

  } catch (error) {
    console.log({ message: error.message });
  }
}

/** Login API */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await AuthSchema.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User Not Found',
    });
  }

  const isMatched = await comparePassword(password, user.password);

  if (!isMatched) {
    return res.status(406).json({
      success: false,
      message: 'Invalid credentials',
    });
  }
  let token = generateToken(user);

  res.header('authorization', token).send({
    success: true,
    token: token,
  });
}

/** Reset Password API */
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // check if the user exist in database
    const user = await AuthSchema.findOne({ email });

    if (!user) {
      throw new Error("Email does not exist");
    }

    // create a random reset code and save it to the user's document
    const resetCode = Math.random().toString(36).slice(-8);
    
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = Date.now() + 2 * 60 * 1000 // 5 min expire in one
    user.save();

    console.log(user);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'guruprasathmsc@gmail.com',
        pass: process.env.NODE_MAILLER_KEY,
      }
    });

    const message = {
      from: 'guruprasathmsc@gmail.com',
      to: user.email,
      subject: 'Password Reset Request',
      text: `Your Reciving htis email because you (or someone else) have reset your password \n\n Please follow the token : ${resetCode}`
    }

    transporter.sendMail(message, (err, info) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong, Try again later' });
      }
      res.status(200).json({ message: 'Email sent successfully ' + info.response })
    })

  } catch (error) {
    console.log({ message: error.message });
  }
}

/** Verify OTP */
exports.verifyOtp = async (req, res) => {
  const { otp } = req.params;
  const { password } = req.body;

  const user = await AuthSchema.findOne({
    resetPasswordToken: otp,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(404).json({ message: 'Invalid OTP password reset link or it has expired.' });
  }else{
    const encPassword = await hashPassword(password);
    user.password = encPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
  
    try {
      await user.save();
      res.status(201).json(user);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

};

/** Logout User */
exports.logout = async (req, res) => {
  session.Cookie.set('test', '1234')
  console.log(session.Cookie.test);;
};

