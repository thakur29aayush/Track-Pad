const { z } = require("zod");
const prisma = require("../config/prisma");
const { createRazorpayOrder } = require("../services/payment.service");
const verifyRazorpayPayment = require("../utils/verifyRazorpay");
const { createPurchaseAccess } = require("../services/access.service");

const createOrderSchema = z.object({
  productIds: z.array(z.string()).min(1),
});

const verifyPaymentSchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

async function createOrder(req, res, next) {
  try {
    const { productIds } = createOrderSchema.parse(req.body);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "Invalid product selected." });
    }

    const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        currency: "INR",
        items: {
          create: products.map((product) => ({
            productId: product.id,
            price: product.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    const razorpayOrder = await createRazorpayOrder({
      amount: totalAmount,
      currency: "INR",
      receipt: order.id,
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    res.status(201).json({
      order: updatedOrder,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = verifyPaymentSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.razorpayOrderId !== razorpayOrderId) {
      return res.status(400).json({ message: "Invalid order." });
    }

    const isValid = verifyRazorpayPayment({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });

      return res.status(400).json({ message: "Payment verification failed." });
    }

    const paidOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    await createPurchaseAccess({
      userId: req.user.id,
      orderId: paidOrder.id,
    });

    res.json({
      message: "Payment verified successfully.",
      order: paidOrder,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  verifyPayment,
};