const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const { upload } = require("../middleware/upload");

const {
  getAdminUsers,
  updateAdminUser,
  suspendAdminUser,
  unsuspendAdminUser,
  deleteAdminUser,
} = require("../controllers/adminUser.controller");

const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const {
  getAdminStats,
  getAdminOrders,
  deleteAdminOrder,
  clearAdminOrders,
} = require("../controllers/admin.controller");

const {
  getAdminBookings,
  updateBooking,
} = require("../controllers/counselling.controller");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getAdminStats);
router.get("/orders", getAdminOrders);
router.delete("/orders/:id", deleteAdminOrder);
router.delete("/orders", clearAdminOrders);

router.get("/users", getAdminUsers);
router.put("/users/:id", updateAdminUser);
router.patch("/users/:id/suspend", suspendAdminUser);
router.patch("/users/:id/unsuspend", unsuspendAdminUser);
router.delete("/users/:id", deleteAdminUser);

router.post("/products", upload.single("thumbnail"), createProduct);
router.post(
  "/products",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "tutorialImage", maxCount: 1 },
  ]),
  createProduct
);

router.put(
  "/products/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "tutorialImage", maxCount: 1 },
  ]),
  updateProduct
);
router.delete("/products/:id", deleteProduct);

router.get("/counselling", getAdminBookings);
router.put("/counselling/:id", updateBooking);

module.exports = router;