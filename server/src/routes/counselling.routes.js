const express = require("express");
const { createBooking } = require("../controllers/counselling.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/book", authMiddleware, createBooking);

module.exports = router;