const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, "Room Number is required"],
  },
  capacity: {
    type: Number,
    required: [true, "Please Enter capacity of the Room"],
  },
  currentOccupancy: {
    type: Number,
    default: 0,
  },
  isVacant: { type: Boolean, default: true },
  hostlers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hostler" }],
});

// Static method to get Room ID by Room Number
/*roomSchema.statics.getRoomIdByNumber = async function (roomNumber) {
  const room = await this.findOne({ roomNumber: roomNumber });
  return room ? room._id : null;
};*/

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
