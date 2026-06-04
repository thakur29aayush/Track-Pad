const prisma = require("../config/prisma");

async function getMyPurchases(req, res, next) {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId: req.user.id },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ purchases });
  } catch (error) {
    next(error);
  }
}

async function getProductAccess(req, res, next) {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: req.params.productId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!purchase) {
      return res.status(403).json({ message: "Product not purchased." });
    }

    res.json({
      product: purchase.product,
      access: {
        accessUrl: purchase.accessUrl,
        fileUrl: purchase.fileUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyPurchases,
  getProductAccess,
};