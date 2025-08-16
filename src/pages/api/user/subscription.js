import { authenticateRequest } from "../../../lib/services/auth";
import subscriptionService from "../../../lib/services/subscriptionService";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await authenticateRequest(req);

    const usageStatus = await subscriptionService.getCurrentUsage(user.id);
    const limits = await subscriptionService.getSubscriptionLimits(user.id);

    res.json({
      subscription: {
        tier: user.subscriptionTier,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
      },
      usage: {
        remainingUploadsToday: usageStatus.remainingUploadsToday,
        remainingUploadsThisMonth: usageStatus.remainingUploadsThisMonth,
        remainingQuestionsThisMonth: usageStatus.remainingQuestionsThisMonth,
      },
      limits: {
        maxFileSizeMB: limits.maxFileSizeMB,
        maxPdfUploadsPerDay: limits.maxPdfUploadsPerDay,
        maxQuestionsPerMonth: limits.maxQuestionsPerMonth,
        maxPdfUploadsPerMonth: limits.maxPdfUploadsPerMonth,
        documentRetentionDays: limits.documentRetentionDays,
        features: limits.features,
      },
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    if (error.message.includes("Authentication")) {
      res.status(401).json({ error: "Authentication required" });
    } else {
      res
        .status(500)
        .json({ error: `Error getting subscription status: ${error.message}` });
    }
  }
}
