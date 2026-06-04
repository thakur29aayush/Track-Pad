const { z } = require("zod");
const prisma = require("../config/prisma");

const bookingSchema = z.object({
  productId: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

async function createBooking(req, res, next) {
  try {
    const data = bookingSchema.parse(req.body);

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product || product.deliveryType !== "BOOKING") {
      return res.status(400).json({ message: "Invalid counselling product." });
    }

    const booking = await prisma.counsellingBooking.create({
      data: {
        userId: req.user.id,
        productId: data.productId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
        message: data.message,
      },
    });

    res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
}

async function getAdminBookings(req, res, next) {
  try {
    const bookings = await prisma.counsellingBooking.findMany({
      include: {
        user: true,
        product: true,
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}

async function updateBooking(req, res, next) {
  try {
    const schema = z.object({
      status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
    });

    const { status } = schema.parse(req.body);

    const booking = await prisma.counsellingBooking.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({ booking });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBooking,
  getAdminBookings,
  updateBooking,
};