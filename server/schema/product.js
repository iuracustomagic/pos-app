const mongoose = require("mongoose");

const productDefineSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: mongoose.Types.ObjectId
  },
  name: {
    type: String,
    required: true
  },
  alcohol: {
    type: Boolean,
    default: false
  },
  category: {
    type: "String",
    lowercase: true,
    trim: true,
    default: null
  },
  nds: {
    type: Number,
    required: true,
    min: 0
  },
  img: {
    type: "String",
    default: "default.jpg"
  },
  discount: {
    type: "Array",
    default: null
  },
  stock: {
    type: Number,
    default: 0
  },
  stock_disable: {
    type: Boolean,
    default: true
  },
  weight: {
    type: "Boolean",
    default: false
  },
  addition: {
    type: [
      {
        barcode: {
          type: "String",
          unique: true,
          sparse: true
        },
        measure: {
          type: "Number",
          default: 1,
          min: 0
        },
        popularity: {
          type: "Number",
          default: 0
        },
        price: {
          type: "Number",
          required: true,
          min: 0
        }
      }
    ],
    validate: (v) =>
      !v || !!v.every((record) => "measure" in record && "barcode" in record)
  }
});

module.exports = mongoose.model("products", productDefineSchema);
