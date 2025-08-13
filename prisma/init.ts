import { prisma } from "../src/lib/prisma";

export async function initializeDatabase() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Run any initialization logic here
    // For example, create demo user if in development
    if (process.env.NODE_ENV === 'development') {
      await createDemoUserIfNotExists();
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function createDemoUserIfNotExists() {
  const bcrypt = await import('bcryptjs');
  
  const existingDemo = await prisma.user.findFirst({
    where: { isDemo: true }
  });

  if (!existingDemo) {
    await prisma.user.create({
      data: {
        email: 'demo@example.com',
        passwordHash: await bcrypt.hash('demo123', 12),
        isActive: true,
        isDemo: true,
      }
    });
    console.log('✅ Demo user created');
  }
}
