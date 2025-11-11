const mongoose = require("mongoose");
const hasher = require("../helpers/hasher");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: "user",
  },
});

userSchema.pre("save", async function (next) {
  this.password = await hasher.hash(this.password, hasher.saltRounds);
  next();
});

module.exports = mongoose.model("User", userSchema);
