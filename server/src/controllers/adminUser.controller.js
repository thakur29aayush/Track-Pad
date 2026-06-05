const prisma = require("../config/prisma");

async function getAdminUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            otps: true,
            orders: true,
            purchases: true,
            bookings: true,
          },
        },
        purchases: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                type: true,
              },
            },
            order: {
              select: {
                id: true,
                status: true,
                totalAmount: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        orders: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        bookings: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            preferredDate: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const formattedUsers = users.map((user) => {
      const paidPurchases = user.purchases.filter(
        (purchase) => purchase.order?.status === "PAID"
      );

      const totalSpent = paidPurchases.reduce((sum, purchase) => {
        return sum + Number(purchase.product?.price || 0);
      }, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,

        counts: {
          otps: user._count.otps,
          orders: user._count.orders,
          purchases: user._count.purchases,
          bookings: user._count.bookings,
        },

        totalPurchases: paidPurchases.length,
        totalSpent,

        productsBought: paidPurchases.map((purchase) => ({
          id: purchase.product?.id,
          title: purchase.product?.title,
          price: purchase.product?.price,
          type: purchase.product?.type,
          orderId: purchase.order?.id,
          orderStatus: purchase.order?.status,
          purchasedAt: purchase.createdAt,
        })),

        orders: user.orders.map((order) => ({
          id: order.id,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
        })),

        bookings: user.bookings.map((booking) => ({
          id: booking.id,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          preferredDate: booking.preferredDate,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          createdAt: booking.createdAt,
        })),
      };
    });

    res.json({
      users: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
}

async function updateAdminUser(req, res, next) {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      role,
      isVerified,
    } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && {
          email: email.trim().toLowerCase(),
        }),
        ...(phone !== undefined && { phone }),
        ...(role !== undefined && { role }),
        ...(isVerified !== undefined && { isVerified }),
      },
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
}
async function suspendAdminUser(req, res, next) {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot suspend yourself.",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        isSuspended: true,
      },
    });

    res.json({
      message: "User suspended.",
      user,
    });
  } catch (error) {
    next(error);
  }
}
async function unsuspendAdminUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id },
      data: {
        isSuspended: false,
      },
    });

    res.json({
      message: "User unsuspended.",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteAdminUser(req, res, next) {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      return res.status(400).json({
        message: "You cannot delete your own admin account.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: "User and all related data deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAdminUsers,
  updateAdminUser,
  suspendAdminUser,
  unsuspendAdminUser,
  deleteAdminUser,
};