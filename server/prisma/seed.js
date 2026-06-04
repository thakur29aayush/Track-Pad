const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const adminEmail = "thakur29aayush@gmail.com";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      role: "ADMIN",
      isVerified: true,
    },
  });

  const products = [
    {
      title: "Notion Productivity Template",
      slug: "notion-productivity-template",
      description: "A complete Notion dashboard for tasks, goals, and daily planning.",
      price: 499,
      type: "NOTION_TEMPLATE",
      deliveryType: "LINK",
      deliveryUrl: "https://example.com/notion-template",
    },
    {
      title: "Habit Tracker",
      slug: "habit-tracker",
      description: "Track habits, streaks, mood, and progress in a clean dashboard.",
      price: 299,
      type: "HABIT_TRACKER",
      deliveryType: "LINK",
      deliveryUrl: "https://example.com/habit-tracker",
    },
    {
      title: "Digital Planner",
      slug: "digital-planner",
      description: "A downloadable planner for productivity and self-growth.",
      price: 399,
      type: "DIGITAL_PRODUCT",
      deliveryType: "FILE",
      fileUrl: "https://example.com/digital-planner.pdf",
    },
    {
      title: "Counselling Session",
      slug: "counselling-session",
      description: "A paid one-to-one counselling session booking.",
      price: 999,
      type: "COUNSELLING",
      deliveryType: "BOOKING",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });