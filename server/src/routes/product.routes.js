const express = require("express");

const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { upload } = require("../middleware/upload");

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "tutorialImage", maxCount: 1 },
  ]),
  createProduct
);

router.patch(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "tutorialImage", maxCount: 1 },
  ]),
  updateProduct
);
router.delete("/:id", deleteProduct);

module.exports = router;