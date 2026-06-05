const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { clientUrl } = require("./config/env");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const paymentRoutes = require("./routes/payment.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const counsellingRoutes = require("./routes/counselling.routes");
const adminRoutes = require("./routes/admin.routes");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// Required for Render, Railway, Heroku, etc.
// Fixes express-rate-limit X-Forwarded-For warning
app.set("trust proxy", 1);

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// Razorpay webhook must receive RAW body
// This MUST come before express.json()
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

// Normal JSON parsing for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital product store API running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/counselling", counsellingRoutes);
app.use("/api/admin", adminRoutes);

// Error handler should always be last
app.use(errorMiddleware);

module.exports = app;