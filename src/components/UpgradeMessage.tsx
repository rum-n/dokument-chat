"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

interface SubscriptionData {
  subscription: {
    tier: "FREE" | "PREMIUM" | "ULTIMATE";
  };
}

const UpgradeMessage: React.FC = () => {
  const { language } = useLanguage();
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch("/api/user/subscription", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubscriptionData(data);
        }
      } catch (err) {
        console.error("Error fetching subscription status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  if (
    loading ||
    !subscriptionData ||
    subscriptionData.subscription.tier !== "FREE"
  ) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0"
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
  );
};

export default UpgradeMessage;
