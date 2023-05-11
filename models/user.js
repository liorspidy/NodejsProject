const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birthday: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
