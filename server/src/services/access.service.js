const prisma = require("../config/prisma");

async function createPurchaseAccess({ userId, orderId }) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order || order.status !== "PAID") {
    throw new Error("Paid order not found.");
  }

  const purchases = [];

  for (const item of order.items) {
    if (item.product.deliveryType === "BOOKING") continue;

    const purchase = await prisma.purchase.upsert({
      where: {
        userId_productId: {
          userId,
          productId: item.productId,
        },
      },
      update: {
        orderId,
        accessUrl: item.product.deliveryUrl,
        fileUrl: item.product.fileUrl,
      },
      create: {
        userId,
        productId: item.productId,
        orderId,
        accessUrl: item.product.deliveryUrl,
        fileUrl: item.product.fileUrl,
      },
    });

    purchases.push(purchase);
  }

  return purchases;
}

module.exports = {
  createPurchaseAccess,
};