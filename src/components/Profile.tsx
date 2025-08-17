"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import { User, Settings, CreditCard, BarChart3 } from "lucide-react";

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

const Profile: React.FC = () => {
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
      <div className="space-y-6">
        <div className="card p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <div className="text-red-600">Error loading profile: {error}</div>
        </div>
      </div>
    );
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
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {language === "bg" ? "Профил" : "Profile"}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      {subscriptionData && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {language === "bg" ? "Абонамент" : "Subscription"}
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(
                subscriptionData.subscription.tier
              )}`}
            >
              {getTierName(subscriptionData.subscription.tier)}
            </span>
          </div>

          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {subscriptionData.usage.remainingUploadsToday === -1
                  ? "∞"
                  : subscriptionData.usage.remainingUploadsToday}
              </div>
              <div className="text-sm text-gray-600">
                {language === "bg" ? "Качвания днес" : "Uploads Today"}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {subscriptionData.usage.remainingQuestionsThisMonth === -1
                  ? "∞"
                  : subscriptionData.usage.remainingQuestionsThisMonth}
              </div>
              <div className="text-sm text-gray-600">
                {language === "bg"
                  ? "Въпроси този месец"
                  : "Questions This Month"}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {subscriptionData.limits.maxFileSizeMB}MB
              </div>
              <div className="text-sm text-gray-600">
                {language === "bg" ? "Макс. размер на файл" : "Max File Size"}
              </div>
            </div>
          </div>

          {/* Detailed Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">
                {language === "bg" ? "Лимити" : "Limits"}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === "bg"
                      ? "Качвания на ден:"
                      : "Uploads per day:"}
                  </span>
                  <span className="font-medium">
                    {subscriptionData.limits.maxPdfUploadsPerDay === -1
                      ? "∞"
                      : subscriptionData.limits.maxPdfUploadsPerDay}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === "bg"
                      ? "Качвания на месец:"
                      : "Uploads per month:"}
                  </span>
                  <span className="font-medium">
                    {subscriptionData.limits.maxPdfUploadsPerMonth === -1
                      ? "∞"
                      : subscriptionData.limits.maxPdfUploadsPerMonth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === "bg"
                      ? "Въпроси на месец:"
                      : "Questions per month:"}
                  </span>
                  <span className="font-medium">
                    {subscriptionData.limits.maxQuestionsPerMonth === -1
                      ? "∞"
                      : subscriptionData.limits.maxQuestionsPerMonth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === "bg"
                      ? "Запазване на документи:"
                      : "Document retention:"}
                  </span>
                  <span className="font-medium">
                    {subscriptionData.limits.documentRetentionDays === -1
                      ? language === "bg"
                        ? "Завинаги"
                        : "Forever"
                      : `${subscriptionData.limits.documentRetentionDays} ${
                          language === "bg" ? "дни" : "days"
                        }`}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">
                {language === "bg" ? "Включени функции:" : "Included Features:"}
              </h4>
              <ul className="space-y-2">
                {subscriptionData.limits.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
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
          </div>

          {/* Subscription Dates */}
          {(subscriptionData.subscription.startDate ||
            subscriptionData.subscription.endDate) && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-3">
                {language === "bg"
                  ? "Информация за абонамента"
                  : "Subscription Information"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {subscriptionData.subscription.startDate && (
                  <div>
                    <span className="text-gray-600">
                      {language === "bg" ? "Начална дата:" : "Start Date:"}
                    </span>
                    <span className="ml-2 font-medium">
                      {new Date(
                        subscriptionData.subscription.startDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {subscriptionData.subscription.endDate && (
                  <div>
                    <span className="text-gray-600">
                      {language === "bg" ? "Крайна дата:" : "End Date:"}
                    </span>
                    <span className="ml-2 font-medium">
                      {new Date(
                        subscriptionData.subscription.endDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upgrade Message for Free Users */}
          {subscriptionData.subscription.tier === "FREE" && (
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-orange-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="font-medium text-orange-900">
                    {language === "bg"
                      ? "Обновете до Премиум"
                      : "Upgrade to Premium"}
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    {language === "bg"
                      ? "Получете повече функции, по-високи лимити и приоритетна поддръжка!"
                      : "Get more features, higher limits, and priority support!"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Account Settings */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {language === "bg" ? "Настройки на акаунта" : "Account Settings"}
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              {language === "bg" ? "Имейл адрес:" : "Email Address:"}
            </span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              {language === "bg" ? "Език:" : "Language:"}
            </span>
            <span className="font-medium">
              {language === "bg" ? "Български" : "English"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
