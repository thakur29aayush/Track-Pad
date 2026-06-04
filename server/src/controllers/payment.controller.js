const { z } = require("zod");
const crypto = require("crypto");
const prisma = require("../config/prisma");
const { razorpayWebhookSecret } = require("../config/env");
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

    const totalAmount = products.reduce(
      (sum, product) => sum + product.price,
      0
    );

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

      return res.status(400).json({
        message: "Payment verification failed.",
      });
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
      userId: paidOrder.userId,
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

async function razorpayWebhook(req, res, next) {
  try {
    const signature = req.headers["x-razorpay-signature"];

    if (!razorpayWebhookSecret) {
      return res.status(500).json({
        message: "Webhook secret not configured.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpayWebhookSecret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({
        message: "Invalid webhook signature.",
      });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const razorpayOrderId =
        event.payload?.payment?.entity?.order_id ||
        event.payload?.order?.entity?.id;

      const razorpayPaymentId =
        event.payload?.payment?.entity?.id || undefined;

      if (razorpayOrderId) {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId },
        });

        if (order && order.status !== "PAID") {
          const paidOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "PAID",
              razorpayPaymentId:
                razorpayPaymentId || order.razorpayPaymentId,
            },
          });

          await createPurchaseAccess({
            userId: paidOrder.userId,
            orderId: paidOrder.id,
          });
        }
      }
    }

    if (event.event === "payment.failed") {
      const razorpayOrderId = event.payload?.payment?.entity?.order_id;

      if (razorpayOrderId) {
        await prisma.order.updateMany({
          where: {
            razorpayOrderId,
            status: "PENDING",
          },
          data: {
            status: "FAILED",
          },
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  razorpayWebhook,
};