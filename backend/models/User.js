const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  companyName: String,
  age: Number,
  dob: String,
  image: String,
});

module.exports = mongoose.model("user", userSchema);
