import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

interface SubscriptionData {
  subscription: {
    tier: "FREE" | "PREMIUM" | "ULTIMATE";
    startDate?: string;
    endDate?: string;
  };
  usage: {
    remainingUploadsToday: number;
    remainingUploadsThisMonth: number;
    remainingQuestionsThisMonth: number;
  };
  limits: {
    maxFileSizeMB: number;
    maxPdfUploadsPerDay: number;
    maxQuestionsPerMonth: number;
    maxPdfUploadsPerMonth: number;
    documentRetentionDays: number;
    features: string[];
  };
}

const SubscriptionStatus: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch("/api/user/subscription", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch subscription status");
        }

        const data = await response.json();
        setSubscriptionData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-red-600">
          Error loading subscription status: {error}
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "FREE":
        return "text-gray-600 bg-gray-100";
      case "PREMIUM":
        return "text-orange-600 bg-orange-100";
      case "ULTIMATE":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case "FREE":
        return language === "bg" ? "Безплатен" : "Free";
      case "PREMIUM":
        return language === "bg" ? "Премиум" : "Premium";
      case "ULTIMATE":
        return language === "bg" ? "Ултимативен" : "Ultimate";
      default:
        return tier;
    }
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {language === "bg" ? "Абонамент" : "Subscription"}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(
            subscriptionData.subscription.tier
          )}`}
        >
          {getTierName(subscriptionData.subscription.tier)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {subscriptionData.usage.remainingUploadsToday === -1
              ? "∞"
              : subscriptionData.usage.remainingUploadsToday}
          </div>
          <div className="text-sm text-gray-600">
            {language === "bg" ? "Качвания днес" : "Uploads Today"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {subscriptionData.usage.remainingQuestionsThisMonth === -1
              ? "∞"
              : subscriptionData.usage.remainingQuestionsThisMonth}
          </div>
          <div className="text-sm text-gray-600">
            {language === "bg" ? "Въпроси този месец" : "Questions This Month"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {subscriptionData.limits.maxFileSizeMB}MB
          </div>
          <div className="text-sm text-gray-600">
            {language === "bg" ? "Макс. размер на файл" : "Max File Size"}
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-800 mb-2">
          {language === "bg" ? "Включени функции:" : "Included Features:"}
        </h4>
        <ul className="space-y-1">
          {subscriptionData.limits.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {subscriptionData.subscription.tier === "FREE" && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-orange-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-orange-700">
              {language === "bg"
                ? "Обновете до Премиум за повече функции и лимити!"
                : "Upgrade to Premium for more features and limits!"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
