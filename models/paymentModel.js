const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  hostler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostler",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "Online",
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
