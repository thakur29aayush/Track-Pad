const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "trackkpad@gmail.com";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      isVerified: true,
      name: "Admin",
      phone: "9142057635",
    },
    create: {
      email: adminEmail,
      name: "Admin",
      phone: "9142057635",
      role: "ADMIN",
      isVerified: true,
    },
  });

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