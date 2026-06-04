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

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Digital product store API running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/counselling", counsellingRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorMiddleware);

module.exports = app;