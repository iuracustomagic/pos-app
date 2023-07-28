const mongoose = require('mongoose');

const transactionDefineSchema = new mongoose.Schema({
  sum: {
    type: 'Number',
  },
  clientSum: {
    type: 'Number',
  },
  items: {
    type: [{
      _id: {
        type: String,
        default: mongoose.Types.ObjectId,
      },
      qty: {
        type: Number,
        required: true,
      },
      countedPrice: {
        type: Number,
        required: true,
      },
      fullPrice: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    }],
  },
  mode: {
    type: [{
      mode: Number,
      sum: Number,
    }],
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('transactions', transactionDefineSchema);
