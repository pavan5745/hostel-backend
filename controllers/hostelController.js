const Hostel = require("../models/hostelModel");
const Room = require("../models/roomModel");
const Hostler = require("../models/hostlerModel");

// Get All Rooms in Hostel
exports.getAllRoomsInHostel = async (req, res) => {
  const { hostelId } = req.params;

  try {
    const hostel = await Hostel.findById(hostelId).populate({
      path: "rooms",
      populate: {
        path: "hostlers",
        model: "Hostler", // Assuming 'Hostler' is the model name for tenants
      },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    res.status(200).json({ rooms: hostel.rooms });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add Room to Hostel
exports.addRoomToHostel = async (req, res) => {
  const { hostelId } = req.params;
  const { roomNumber, capacity } = req.body;

  try {
    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // Check if the room number already exists in the hostel
    const existingRoom = await Room.findOne({
      roomNumber,
      _id: { $in: hostel.rooms },
    });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Room number already exists in this hostel" });
    }

    const newRoom = new Room({ roomNumber, capacity });
    await newRoom.save();

    hostel.rooms.push(newRoom._id);
    await hostel.save();

    res.status(201).json({ message: "Room added", room: newRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get Room and Room members
// Get Particular Room and Its Membersexports.getRoomAndMembers = async (req, res) => {
exports.getRoomAndMembers = async (req, res) => {
  const { hostelId, roomId } = req.params;

  try {
    const hostel = await Hostel.findById(hostelId).populate({
      path: "rooms",
      match: { _id: roomId },
      populate: {
        path: "hostlers",
        model: "Hostler",
      },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const room = hostel.rooms.find((room) => room._id.toString() === roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Edit Room in Hostel
exports.editRoomInHostel = async (req, res) => {
  const { roomId } = req.params;
  const { roomNumber, capacity, currentOccupancy, tenants } = req.body; // Include tenants in the request body
  const tenn = [];
  tenants.forEach((el) => {
    tenn.push(el._id);
  });
  try {
    const room = await Room.findById(roomId).populate("hostlers");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.roomNumber = roomNumber;
    room.capacity = capacity;
    room.currentOccupancy = currentOccupancy;
    room.isVacant = capacity > currentOccupancy;
    //room.tenants = tenn;
    // Update tenants' active status
    /* await Promise.all(
      room.hostlers.map(async (tenant) => {
        tenant.isActive = tenants.includes(tenant._id.toString());
        return tenant.save();
      })
    );*/

    await room.save();

    res.status(200).json({ message: "Room updated", room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Room from Hostel
exports.deleteRoomFromHostel = async (req, res) => {
  const { hostelId, roomId } = req.params;

  try {
    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const roomIndex = hostel.rooms.indexOf(roomId);
    if (roomIndex > -1) {
      hostel.rooms.splice(roomIndex, 1);
      await hostel.save();
      await Room.findByIdAndDelete(roomId);
    } else {
      return res.status(404).json({ message: "Room not found in hostel" });
    }

    res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
