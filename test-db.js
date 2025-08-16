const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Test User table
    const userCount = await prisma.user.count();
    console.log(`✅ User table accessible - ${userCount} users found`);

    // Test SubscriptionUsage table
    const usageCount = await prisma.subscriptionUsage.count();
    console.log(
      `✅ SubscriptionUsage table accessible - ${usageCount} usage records found`
    );

    // Test PDF table
    const pdfCount = await prisma.pDF.count();
    console.log(`✅ PDF table accessible - ${pdfCount} PDFs found`);

    // Test PDFChunk table
    const chunkCount = await prisma.pDFChunk.count();
    console.log(`✅ PDFChunk table accessible - ${chunkCount} chunks found`);

    // Test subscription tiers
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
      },
    });

    console.log("\n📊 User subscription data:");
    users.forEach((user) => {
      console.log(`  - ${user.email}: ${user.subscriptionTier || "FREE"}`);
    });

    console.log("\n✅ All database tests passed!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
