const mongoose = require("mongoose");

const cardDefineSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  funded: {
    type: Boolean,
    default: false
  },
  regular: {
    percent: {
      type: Number,
      min: 0
    }
  }
});

module.exports = mongoose.model("cards", cardDefineSchema);
