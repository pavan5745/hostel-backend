const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

//router.patch("/updateMe", authController.protect, userController.updateMe);
//router.delete("/deleteMe", authController.protect, userController.deleteMe);

// Route to add a room to a hostel
router.post(
  "/:hostelId/rooms",
  authController.protect,
  authController.restrictTo("admin"),
  hostelController.addRoomToHostel
);

// Route to edit a room in a hostel
router.put(
  "/:hostelId/rooms/:roomId",
  authController.protect,
  authController.protect,
  authController.restrictTo("admin"),
  hostelController.editRoomInHostel
);

//Route to get perticular room

router.get(
  "/:hostelId/rooms/:roomId",
  authController.protect,
  authController.restrictTo("admin"),
  hostelController.getRoomAndMembers
);

//Route to get all the room details in the hostel
router.get(
  "/:hostelId",
  authController.protect,
  authController.restrictTo("admin"),
  hostelController.getAllRoomsInHostel
);

// Route to delete a room from a hostel
router.delete(
  "/:hostelId/rooms/:roomId",
  authController.protect,
  authController.restrictTo("admin"),
  hostelController.deleteRoomFromHostel
);

module.exports = router;
