const express = require("express");
const {
  getMyPurchases,
  getProductAccess,
} = require("../controllers/purchase.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/my", authMiddleware, getMyPurchases);
router.get("/:productId/access", authMiddleware, getProductAccess);

module.exports = router;