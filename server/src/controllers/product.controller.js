const { z } = require("zod");
const prisma = require("../config/prisma");
const createSlug = require("../utils/slug");

const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.number().int().positive(),
  type: z.enum([
    "NOTION_TEMPLATE",
    "HABIT_TRACKER",
    "DIGITAL_PRODUCT",
    "COUNSELLING",
    "OTHER",
  ]),
  deliveryType: z.enum(["LINK", "FILE", "BOTH", "BOOKING"]),
  thumbnail: z.string().optional().nullable(),
  deliveryUrl: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

async function getProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const data = productSchema.parse(req.body);
    const slug = createSlug(data.title);

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        currency: "INR",
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const data = productSchema.partial().parse(req.body);

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(data.title ? { slug: createSlug(data.title) } : {}),
      },
    });

    res.json({ product });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });

    res.json({ message: "Product disabled successfully." });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};