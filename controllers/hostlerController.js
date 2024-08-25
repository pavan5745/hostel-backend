const Hostel = require("../models/hostelModel");
const Hostler = require("../models/hostlerModel");
const Room = require("../models/roomModel");
const Payment = require("../models/paymentModel");
const mongoose = require("mongoose");

/*exports.checkInHostler = async (req, res) => {
  //console.log(req);
  const { hostelId, roomId } = req.params;

  try {
    const { joiningDate, ...rest } = req.body;

    // const joiningDate = new Date(joiningDate);

    // Calculate due date as one month from joining date
    const dueDate = new Date(joiningDate);
    dueDate.setMonth(dueDate.getMonth() + 1);

    const lastPaymentDate = new Date(joiningDate);

    const currentDate = new Date();
    const paymentStatus = currentDate <= dueDate ? "Cleared" : "Pending";

    const newHostler = new Hostler({
      ...rest,
      joiningDate: joiningDate,
      dueDate: dueDate,
      lastPaymentDate: lastPaymentDate,
      paymentStatus: paymentStatus,
    });
    console.log(newHostler);

    await newHostler.save();

    const hostel = await Hostel.findById(hostelId).populate("rooms");
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }
    // console.log(hostel.rooms);
    const roomN = hostel.rooms.filter((room) => room._id == roomId);
    const room = roomN[0];
    console.log(room);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.currentOccupancy < room.capacity) {
      room.hostlers.push(newHostler._id);
      room.currentOccupancy++;
      room.isVacant = room.currentOccupancy < room.capacity;

      await room.save();
      return res
        .status(200)
        .json({ message: "Hostler checked in", hostler: newHostler });
    } else {
      return res.status(400).json({ message: "Room is full" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
*/

exports.checkInHostler = async (req, res) => {
  console.log(req.params);
  const { hostelId, roomId } = req.params;

  try {
    const { joiningDate, paymentAmount, paymentMethod, ...rest } = req.body;

    const dueDate = new Date(joiningDate);
    dueDate.setMonth(dueDate.getMonth() + 1);

    const lastPaymentDate = new Date(joiningDate);
    const currentDate = new Date();
    const paymentStatus = currentDate <= dueDate ? "Cleared" : "Pending";

    const newHostler = new Hostler({
      ...rest,
      joiningDate: joiningDate,
      dueDate: dueDate,
      lastPaymentDate: lastPaymentDate,
      paymentStatus: paymentStatus,
    });

    await newHostler.save();

    // Create a new payment record
    const newPayment = new Payment({
      hostler: newHostler._id,
      amount: newHostler.rent,
      paymentDate: lastPaymentDate,
      paymentMethod: paymentMethod,
    });

    await newPayment.save();

    const hostel = await Hostel.findById(hostelId).populate("rooms");
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const roomN = hostel.rooms.filter((room) => room._id == roomId);
    const room = roomN[0];
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.currentOccupancy < room.capacity) {
      room.hostlers.push(newHostler._id);
      room.currentOccupancy++;
      room.isVacant = room.currentOccupancy < room.capacity;

      await room.save();
      return res
        .status(200)
        .json({ message: "Hostler checked in", hostler: newHostler });
    } else {
      return res.status(400).json({ message: "Room is full" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//sorting hostlers
// In your controller file (e.g., hostlerController.js)

exports.getAllHostlers = async (req, res) => {
  try {
    const hostlers = await Hostler.find().sort({ dueDate: 1 }); // Get only active hostlers

    res.status(200).json({
      hostlers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getHostlersSortedByDueDate = async (req, res) => {
  try {
    const hostlers = await Hostler.find().sort({ dueDate: 1 }); // 1 for ascending, -1 for descending

    res.status(200).json({
      hostlers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/*exports.getSortedHostlersByDueDate = async (req, res) => {
  try {
    const currentDate = new Date();

    // Find all active hostlers
    const hostlers = await Hostler.find({ active: true })
      .populate("roomNumber") // Assuming roomNumber is the reference to Room schema
      .lean(); // Using lean() to get plain JavaScript objects

    // Calculate days to due date and add it to each hostler object
    hostlers.forEach((hostler) => {
      const dueDate = new Date(hostler.dueDate);
      const timeDiff = dueDate - currentDate;
      hostler.daysToDueDate = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    });
    console.log(hostlers);

    // Sort hostlers based on due date criteria
    hostlers.sort((a, b) => {
      const aPastDue = a.daysToDueDate < 0;
      const bPastDue = b.daysToDueDate < 0;

      if (aPastDue && bPastDue) {
        // Both past due, sort farthest due date first
        return b.daysToDueDate - a.daysToDueDate;
      } else if (!aPastDue && !bPastDue) {
        // Both not past due, sort nearest due date first
        return a.daysToDueDate - b.daysToDueDate;
      } else {
        // One is past due, the other is not, sort past due first
        return aPastDue ? -1 : 1;
      }
    });

    res.status(200).json({
      hostlers: hostlers.map((hostler) => ({
        name: hostler.name,
        phoneNo: hostler.phoneNo,
        roomNumber: hostler.roomNumber.roomNumber, // Assuming roomNumber is populated
        dueDate: hostler.dueDate,
        daysToDueDate: hostler.daysToDueDate,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};*/

// Edit Hostler

const getRoomIdByNumber = async (roomNumber) => {
  const room = await Room.findOne({ roomNumber });
  return room ? room._id : null;
};

const updateRoomOccupancy = async (roomId) => {
  const room = await Room.findById(roomId);
  if (!room) return;

  const hostlersCount = await Hostler.countDocuments({
    roomNumber: room.roomNumber,
    active: true,
  });
  room.currentOccupancy = hostlersCount;
  room.isVacant = hostlersCount < room.capacity;

  await room.save();
};

exports.editHostler = async (req, res) => {
  const { hostlerId } = req.params;
  console.log(hostlerId);
  const { roomNumber, ...updateData } = req.body;

  try {
    const hostlerObjectId = new mongoose.Types.ObjectId(hostlerId);

    const currentHostler = await Hostler.findById(hostlerObjectId);
    if (!currentHostler) {
      return res.status(404).json({ message: "Hostler not found" });
    }

    const currentRoomId = await getRoomIdByNumber(currentHostler.roomNumber);
    const newRoomId =
      roomNumber && roomNumber !== currentHostler.roomNumber
        ? await getRoomIdByNumber(roomNumber)
        : null;

    if (newRoomId && !newRoomId.equals(currentRoomId)) {
      // Remove hostler from the old room
      await Room.updateOne(
        { _id: currentRoomId },
        { $pull: { hostlers: hostlerObjectId } }
      );

      // Add hostler to the new room
      await Room.updateOne(
        { _id: newRoomId },
        { $push: { hostlers: hostlerObjectId } }
      );

      // Update the hostler's room number
      updateData.roomNumber = roomNumber;
    }

    // Update the hostler's details
    const updatedHostler = await Hostler.findByIdAndUpdate(
      hostlerObjectId,
      updateData,
      { new: true }
    );

    // Update occupancy of both rooms
    await updateRoomOccupancy(currentRoomId);
    if (newRoomId && !newRoomId.equals(currentRoomId)) {
      await updateRoomOccupancy(newRoomId);
    }

    res.json(updatedHostler);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// payment
exports.addPayment = async (req, res) => {
  console.log(req.body);
  const { hostlerId, amount, paymentDate, paymentMethod } = req.body;

  try {
    // Create a new payment record
    const payment = new Payment({
      hostler: hostlerId,
      amount,
      paymentDate,
      paymentMethod,
    });

    await payment.save();

    // Update the hostler document
    const hostler = await Hostler.findById(hostlerId);
    if (!hostler) {
      return res.status(404).json({ message: "Hostler not found" });
    }

    // Update the due date and payment status
    const dueDate = new Date(hostler.dueDate);
    dueDate.setMonth(dueDate.getMonth() + 1);
    const currentDate = new Date();
    const paymentStatus = currentDate <= dueDate ? "Cleared" : "Pending";

    hostler.dueDate = dueDate;
    hostler.paymentStatus = paymentStatus;
    await hostler.save();

    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Hostler (soft delete by setting active to false)
exports.deleteHostler = async (req, res) => {
  const { hostlerId } = req.params;

  try {
    const hostler = await Hostler.findByIdAndUpdate(
      hostlerId,
      { active: false },
      { new: true }
    );

    if (!hostler) {
      return res.status(404).json({ message: "Hostler not found" });
    }

    res.status(200).json({
      message: "Hostler deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Hostler
exports.getHostler = async (req, res) => {
  const { hostlerId } = req.params;
  console.log(req.params);

  try {
    const hostler = await Hostler.findOne({ _id: hostlerId, active: true });

    if (!hostler) {
      return res.status(404).json({ message: "Hostler not found" });
    }

    res.status(200).json({
      hostler,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//total active
exports.getTotalActiveHostlers = async (req, res) => {
  try {
    const activeHostlersCount = await Hostler.countDocuments({ active: true });

    res.status(200).json({
      message: "Total active hostlers",
      count: activeHostlersCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Get Total Income for a Given Month
exports.getTotalIncomeForMonth = async (req, res) => {
  const { year, month } = req.params;

  try {
    // Create start and end dates for the given month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Find all active hostlers who have paid in the given month
    const activeHostlers = await Hostler.find({
      active: true,
      lastPaymentDate: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Calculate the total income
    const totalIncome = activeHostlers.reduce((sum, hostler) => {
      return sum + hostler.rent;
    }, 0);

    res.status(200).json({
      message: `Total income for ${year}-${month}`,
      totalIncome: totalIncome,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMonthlyPayments = async (req, res) => {
  try {
    console.log(req.query);
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required." });
    }

    // Calculate the custom date range
    const startOfCurrentMonth = new Date(year, month - 2, 25); // 25th of the previous month
    const startOfNextMonth = new Date(year, month - 1, 25); // 25th of the current month
    console.log("Date range:", startOfCurrentMonth, startOfNextMonth);
    const payments = await Payment.find({
      paymentDate: { $gte: startOfCurrentMonth, $lt: startOfNextMonth },
    }).populate("hostler", "name roomNumber");
    console.log(payments);
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching monthly payments:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
