const mongoose = require("mongoose");

const discountDefineSchema = new mongoose.Schema({
  _id: {
    type: Number,
    default: mongoose.Types.ObjectId
  },
  regular: {
    percent: {
      type: Number
    },
    if_card: {
      type: Boolean
    }
  },
  date: {
    type: {
      start: {
        type: String,
        required: true
      },
      end: {
        type: Number,
        required: true
      },
      percent: {
        type: Number,
        required: true
      }
    },
    required: false,
    validate: {
      validator: (v) =>
        v.start.split("-").length === 2 && v.end.split("-").length === 2
    }
  },
  guarantee: {
    type: {
      count: {
        type: Number,
        min: 1
      },
      percent: {
        type: Number,
        min: 0
      },
      items: {
        type: [String],
        select: false
      }
    },
    select: false
  }
});

module.exports = mongoose.model("discounts", discountDefineSchema);
