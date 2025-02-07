require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const userRoutes = require("./Routes/user");
const app = express();
const cors = require("cors");
require("./db/conn");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require("uuid");
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); 
const OTP = require('./models/OTP'); 

const PORT = process.env.PORT || 4002;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use(userRoutes);

app.use(session({
  secret: 'abcde',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(cors({
  //origin: 'http://localhost:3000', // for local
  origin: 'https://user-auth-ui.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use("/user", upload.single("image"), userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}

async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD, 
    },
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
}

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    req.session.user.loggedIn = true;

    const otp = generateOTP();
    const otpEntry = new OTP({ email, otp, expiresAt: Date.now() + 600000 });
    await otpEntry.save();

    await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);

    res.json({ message: 'User logged in successfully and OTP sent' });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'User logged out successfully', redirectTo: '/login' });
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

app.post('/api/register', upload.single('image'), async (req, res) => {
  try {
    console.log("here")
    console.log(req.body)
    console.log(req.file)
    const { name, email, password, companyName, age, dob } = req.body;
    const image = req.file ? req.file.filename : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, companyName, age, dob, image });
    console.log(user);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.delete('/api/user/:email', async (req, res) => {
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
});

app.post('/api/verifyOtp', async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server start at Port No :${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});
