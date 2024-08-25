const mongoose = require("mongoose");

const hostlerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  aadharNumber: {
    type: Number,
    required: [true, "Please tell us your Aadhar Number"],
  },
  phoneNo: {
    type: Number,
    required: [true, "Please tell us your Phone Number"],
    length: 10,
  },
  photo: String,
  joiningDate: Date,
  rent: {
    type: Number,
    required: [true, "Room must have rent"],
  },
  roomNumber: {
    type: Number,
    required: [true, "Please allocate a room Number"],
  },
  dueDate: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Cleared"],
    default: "Pending",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Hostler = mongoose.model("Hostler", hostlerSchema);
module.exports = Hostler;
