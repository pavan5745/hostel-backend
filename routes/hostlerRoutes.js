const express = require("express");
const hostlerController = require("./../controllers/hostlerController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post(
  "/:hostelId/:roomId",
  authController.protect,
  authController.restrictTo("admin"),
  hostlerController.checkInHostler
);

router.post(
  "/payments",
  authController.protect,
  authController.restrictTo("admin"),
  hostlerController.addPayment
);

router.get(
  "/monthly-data",
  authController.protect,
  authController.restrictTo("admin"),
  hostlerController.getMonthlyPayments
);

// Route to edit a hostler
router.patch(
  "/:hostlerId",
  authController.protect,
  authController.restrictTo("admin"),
  hostlerController.editHostler
);

// Route to delete a hostler (soft delete)
router.delete("/hostlers/:hostlerId", hostlerController.deleteHostler);

// Route to get a hostler
router.get(
  "/:hostlerId",
  authController.protect,
  authController.restrictTo("admin"),
  hostlerController.getHostler
);
// Route to get sorted hostlers by due date
router.get(
  "/",
  authController.restrictTo("admin"),
  hostlerController.getAllHostlers
);
router.get("/sortHostlers", hostlerController.getHostlersSortedByDueDate);
// total active hostlers
router.get(
  "/hostlers/total-active",
  authController.restrictTo("admin"),
  hostlerController.getTotalActiveHostlers
);

// Route to get total income for a given month
router.get(
  "/hostlers/total-income/:year/:month",
  hostlerController.getTotalIncomeForMonth
);

module.exports = router;
