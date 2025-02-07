const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpEntry = new OTP({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });
  await otpEntry.save();
  await transporter.sendMail({
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, companyName, age, dob } = req.body;
    const image = req.file.filename;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, companyName, age, dob, image });
    console.log(user);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      req.session.user.loggedIn = true;
      await sendOtp(email);
      res.json({ message: 'User logged in successfully. OTP sent to email.' });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await sendOtp(email);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpEntry = await OTP.findOne({ email, otp });
    if (otpEntry && otpEntry.expiresAt > Date.now()) {
      const user = await User.findOne({ email });
      await OTP.deleteOne({ email, otp });
      res.status(200).json({ verified: true, user });
    } else {
      res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (error) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
};

exports.logout = async (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'User logged out successfully' });
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { email } = req.params;
    await User.findOneAndDelete({ email });
    if (req.session.user && req.session.user.email === email) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete account' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'User account deleted successfully' });
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Account deletion failed' });
  }
};
