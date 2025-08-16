import { PrismaClient } from "@prisma/client";
import { SubscriptionTier } from "@prisma/client";

const prisma = new PrismaClient();

export interface SubscriptionLimits {
  maxFileSizeMB: number;
  maxPdfUploadsPerDay: number;
  maxQuestionsPerMonth: number;
  maxPdfUploadsPerMonth: number;
  documentRetentionDays: number;
  features: string[];
}

export interface UsageStatus {
  canUpload: boolean;
  canAskQuestion: boolean;
  remainingUploadsToday: number;
  remainingUploadsThisMonth: number;
  remainingQuestionsThisMonth: number;
  limits: SubscriptionLimits;
}

class SubscriptionService {
  private readonly tierLimits: Record<SubscriptionTier, SubscriptionLimits> = {
    FREE: {
      maxFileSizeMB: 10,
      maxPdfUploadsPerDay: 1,
      maxQuestionsPerMonth: 100,
      maxPdfUploadsPerMonth: 30,
      documentRetentionDays: 1,
      features: ["Basic AI chat support", "Page references in answers"],
    },
    PREMIUM: {
      maxFileSizeMB: 20,
      maxPdfUploadsPerDay: 20,
      maxQuestionsPerMonth: 1000,
      maxPdfUploadsPerMonth: 600,
      documentRetentionDays: 30,
      features: [
        "Priority AI chat support",
        "Advanced search features",
        "Export chat history",
      ],
    },
    ULTIMATE: {
      maxFileSizeMB: 50,
      maxPdfUploadsPerDay: -1, // Unlimited
      maxQuestionsPerMonth: -1, // Unlimited
      maxPdfUploadsPerMonth: -1, // Unlimited
      documentRetentionDays: -1, // Permanent
      features: [
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
        "API access",
      ],
    },
  };

  async getSubscriptionLimits(userId: string): Promise<SubscriptionLimits> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return this.tierLimits[user.subscriptionTier];
  }

  async getCurrentUsage(userId: string): Promise<UsageStatus> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionUsage: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const limits = this.tierLimits[user.subscriptionTier];
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const today = new Date().toDateString();

    // Get or create usage record for current month
    let usage = user.subscriptionUsage;
    if (!usage || usage.month !== currentMonth) {
      usage = await prisma.subscriptionUsage.upsert({
        where: { userId },
        update: {
          month: currentMonth,
          pdfUploadsToday: 0,
          questionsThisMonth: 0,
          pdfUploadsThisMonth: 0,
          lastUploadDate: null,
        },
        create: {
          userId,
          month: currentMonth,
          pdfUploadsToday: 0,
          questionsThisMonth: 0,
          pdfUploadsThisMonth: 0,
        },
      });
    }

    // Reset daily uploads if it's a new day
    if (usage.lastUploadDate && usage.lastUploadDate.toDateString() !== today) {
      usage = await prisma.subscriptionUsage.update({
        where: { userId },
        data: {
          pdfUploadsToday: 0,
          lastUploadDate: new Date(),
        },
      });
    }

    const remainingUploadsToday =
      limits.maxPdfUploadsPerDay === -1
        ? -1
        : Math.max(0, limits.maxPdfUploadsPerDay - usage.pdfUploadsToday);

    const remainingUploadsThisMonth =
      limits.maxPdfUploadsPerMonth === -1
        ? -1
        : Math.max(0, limits.maxPdfUploadsPerMonth - usage.pdfUploadsThisMonth);

    const remainingQuestionsThisMonth =
      limits.maxQuestionsPerMonth === -1
        ? -1
        : Math.max(0, limits.maxQuestionsPerMonth - usage.questionsThisMonth);

    return {
      canUpload: limits.maxPdfUploadsPerDay === -1 || remainingUploadsToday > 0,
      canAskQuestion:
        limits.maxQuestionsPerMonth === -1 || remainingQuestionsThisMonth > 0,
      remainingUploadsToday,
      remainingUploadsThisMonth,
      remainingQuestionsThisMonth,
      limits,
    };
  }

  async recordPdfUpload(userId: string): Promise<void> {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const today = new Date().toDateString();

    await prisma.subscriptionUsage.upsert({
      where: { userId },
      update: {
        month: currentMonth,
        pdfUploadsToday: {
          increment: 1,
        },
        pdfUploadsThisMonth: {
          increment: 1,
        },
        lastUploadDate: new Date(),
      },
      create: {
        userId,
        month: currentMonth,
        pdfUploadsToday: 1,
        pdfUploadsThisMonth: 1,
        lastUploadDate: new Date(),
      },
    });
  }

  async recordQuestion(userId: string): Promise<void> {
    const currentMonth = new Date().toISOString().slice(0, 7);

    await prisma.subscriptionUsage.upsert({
      where: { userId },
      update: {
        month: currentMonth,
        questionsThisMonth: {
          increment: 1,
        },
      },
      create: {
        userId,
        month: currentMonth,
        questionsThisMonth: 1,
      },
    });
  }

  async upgradeSubscription(
    userId: string,
    newTier: SubscriptionTier
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: newTier,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
  }

  async checkFileSizeLimit(
    userId: string,
    fileSizeBytes: number
  ): Promise<boolean> {
    const limits = await this.getSubscriptionLimits(userId);
    const fileSizeMB = fileSizeBytes / (1024 * 1024);
    return fileSizeMB <= limits.maxFileSizeMB;
  }

  async cleanupExpiredDocuments(): Promise<void> {
    const users = await prisma.user.findMany({
      include: { subscriptionUsage: true },
    });

    for (const user of users) {
      const limits = this.tierLimits[user.subscriptionTier];

      if (limits.documentRetentionDays > 0) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - limits.documentRetentionDays);

        // Delete PDFs older than retention period
        await prisma.pDF.deleteMany({
          where: {
            userId: user.id,
            createdAt: {
              lt: cutoffDate,
            },
          },
        });
      }
    }
  }
}

export default new SubscriptionService();
