const prisma = require("../config/prisma");

async function getAdminStats(req, res, next) {
  try {
    const [users, products, orders, bookings] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.counsellingBooking.count(),
    ]);

    res.json({
      stats: {
        users,
        products,
        orders,
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAdminOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

async function getAdminUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAdminStats,
  getAdminOrders,
  getAdminUsers,
};