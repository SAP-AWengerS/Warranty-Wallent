const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  createdAt: { type: Date, default: () => new Date() },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
