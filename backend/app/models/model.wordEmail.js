const mongoose = require("mongoose");

const wordEmailSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 1,
  },
});

module.exports = mongoose.model("WordEmail", wordEmailSchema);
