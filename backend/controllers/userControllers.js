const User = require("../models/User");
const OTP = require("../models/userOtp");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const cors = require("cors");

app.use(cors({
origin: ["https://user-auth-api-rust.vercel.app/"],
methods: ("POST","GET","DELETE"),
credentials: true
}));

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, companyName, age, dob } = req.body;
    const image = req.file.filename;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      companyName,
      age,
      dob,
      image,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpEntry = new OTP({
    email,
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
  await otpEntry.save();
  await transporter.sendMail({
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpEntry = new OTP({
        email,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });
      await otpEntry.save();
      await transporter.sendMail({
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
      });
      res.status(200).json({ otpSent: true });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
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
      res.status(400).json({ error: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: "OTP verification failed" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { email } = req.params;
    await User.findOneAndDelete({ email });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Account deletion failed" });
  }
};
