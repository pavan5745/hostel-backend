const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Hostel must have name"],
    default: "AadiMahalxmi",
  },
  adress: {
    type: String,
    default: "Ameerpet",
  },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
});

const Hostel = mongoose.model("Hostel", hostelSchema);
module.exports = Hostel;
