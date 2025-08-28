"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  MessageCircle,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  Search,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import LanguageSwitcher from "./LanguageSwitcher";
import { useRouter } from "next/navigation";

const LandingPage = (): React.JSX.Element => {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div onClick={() => router.push('/')} className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Dokument Chat
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={() =>
                  document
                    ?.getElementById("use-cases")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                {language === "bg" ? "Приложения" : "Use Cases"}
              </button>
              <button
                onClick={() =>
                  document
                    ?.getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                {language === "bg" ? "Цени" : "Pricing"}
              </button>
              <Link
                href="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                {t.nav.signIn}
              </Link>
              <Link
                href="/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t.nav.getStarted}
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>{t.hero.startChatting}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="text-gray-700 hover:text-primary-600 px-6 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-primary-500 transition-all duration-200 flex items-center space-x-2 hover:bg-primary-50">
                <span>{t.hero.watchDemo}</span>
                <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="bg-primary-100 rounded-lg p-6 mb-6 border-2 border-primary-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          document.pdf
                        </h3>
                        <p className="text-sm text-gray-500">
                          Uploaded successfully
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-8 h-8 bg-success-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-sm font-bold">U</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-gray-800">
                          {language === "bg"
                            ? "Каква е основната тема на документа?"
                            : "What is the main topic of the document?"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-sm font-bold">AI</span>
                      </div>
                      <div className="bg-primary-100 rounded-lg p-3 shadow-md">
                        <p className="text-gray-900">
                          {language === "bg"
                            ? "Основната тема на документа е... "
                            : "The main topic of the document is... "}
                          <span className="text-primary-700 underline font-semibold">
                            [Page 1]
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-primary-50 rounded-xl p-8 hover:shadow-lg transition-all duration-200 border border-primary-100">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t.features.smartPdf.title}
              </h3>
              <p className="text-gray-600">{t.features.smartPdf.description}</p>
            </div>

            <div className="bg-accent-50 rounded-xl p-8 hover:shadow-lg transition-all duration-200 border border-accent-100">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t.features.naturalChat.title}
              </h3>
              <p className="text-gray-600">
                {t.features.naturalChat.description}
              </p>
            </div>

            <div className="bg-success-50 rounded-xl p-8 hover:shadow-lg transition-all duration-200 border border-success-100">
              <div className="w-12 h-12 bg-success-500 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t.features.multilingual.title}
              </h3>
              <p className="text-gray-600">
                {t.features.multilingual.description}
              </p>
            </div>

            <div className="bg-warning-50 rounded-xl p-8 hover:shadow-lg transition-all duration-200 border border-warning-100">
              <div className="w-12 h-12 bg-warning-500 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t.features.smartSearch.title}
              </h3>
              <p className="text-gray-600">
                {t.features.smartSearch.description}
              </p>
            </div>

            <div className="bg-info-50 rounded-xl p-8 hover:shadow-lg transition-all duration-200 border border-info-100">
              <div className="w-12 h-12 bg-info-500 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t.features.secure.title}
              </h3>
              <p className="text-gray-600">{t.features.secure.description}</p>
            </div>

            <div className="bg-premium-50 rounded-xl p-8 hover:shadow-lg transition-all duration-200 border border-premium-100">
              <div className="w-12 h-12 bg-premium-500 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t.features.fast.title}
              </h3>
              <p className="text-gray-600">{t.features.fast.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t.howItWorks.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t.howItWorks.step1.title}
              </h3>
              <p className="text-gray-600">{t.howItWorks.step1.description}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t.howItWorks.step2.title}
              </h3>
              <p className="text-gray-600">{t.howItWorks.step2.description}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t.howItWorks.step3.title}
              </h3>
              <p className="text-gray-600">{t.howItWorks.step3.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.useCases.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.useCases.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Academic & Research */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.useCases.academic.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.useCases.academic.description}
              </p>
              <div className="space-y-2">
                {t.useCases.academic.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {example}
                  </div>
                ))}
              </div>
            </div>

            {/* Business & Finance */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.useCases.business.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.useCases.business.description}
              </p>
              <div className="space-y-2">
                {t.useCases.business.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    {example}
                  </div>
                ))}
              </div>
            </div>

            {/* Legal & Compliance */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.useCases.legal.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.useCases.legal.description}
              </p>
              <div className="space-y-2">
                {t.useCases.legal.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                    {example}
                  </div>
                ))}
              </div>
            </div>

            {/* Technical & Manuals */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.useCases.technical.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.useCases.technical.description}
              </p>
              <div className="space-y-2">
                {t.useCases.technical.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                    {example}
                  </div>
                ))}
              </div>
            </div>

            {/* Healthcare & Medical */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.useCases.healthcare.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.useCases.healthcare.description}
              </p>
              <div className="space-y-2">
                {t.useCases.healthcare.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                    {example}
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Training */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t.useCases.education.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.useCases.education.description}
              </p>
              <div className="space-y-2">
                {t.useCases.education.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                    {example}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 hover:shadow-xl transition-all duration-200 ${
                t.pricing.free.popular
                  ? "border-blue-500 scale-105"
                  : "border-gray-200"
              }`}
            >
              {t.pricing.free.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t.pricing.free.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {t.pricing.free.price}
                  </span>
                  <span className="text-gray-600">{t.pricing.free.period}</span>
                </div>
                <p className="text-gray-600 mb-8">
                  {t.pricing.free.description}
                </p>

                <ul className="space-y-4 mb-8 text-left">
                  {t.pricing.free.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    t.pricing.free.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {t.pricing.free.button}
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 hover:shadow-xl transition-all duration-200 ${
                t.pricing.premium.popular
                  ? "border-blue-500 scale-105"
                  : "border-gray-200"
              }`}
            >
              {t.pricing.premium.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {language === "bg" ? "Най-Популярен" : "Most Popular"}
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t.pricing.premium.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {t.pricing.premium.price}
                  </span>
                  <span className="text-gray-600">
                    {t.pricing.premium.period}
                  </span>
                </div>
                <p className="text-gray-600 mb-8">
                  {t.pricing.premium.description}
                </p>

                <ul className="space-y-4 mb-8 text-left">
                  {t.pricing.premium.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    t.pricing.premium.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {t.pricing.premium.button}
                </Link>
              </div>
            </div>

            {/* Ultimate Plan */}
            <div
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 hover:shadow-xl transition-all duration-200 ${
                t.pricing.ultimate.popular
                  ? "border-blue-500 scale-105"
                  : "border-gray-200"
              }`}
            >
              {t.pricing.ultimate.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {language === "bg" ? "Най-Популярен" : "Most Popular"}
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t.pricing.ultimate.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {t.pricing.ultimate.price}
                  </span>
                  <span className="text-gray-600">
                    {t.pricing.ultimate.period}
                  </span>
                </div>
                <p className="text-gray-600 mb-8">
                  {t.pricing.ultimate.description}
                </p>

                <ul className="space-y-4 mb-8 text-left">
                  {t.pricing.ultimate.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    t.pricing.ultimate.popular
                      ? "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {t.pricing.ultimate.button}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t.cta.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {t.cta.subtitle}
          </p>
          <Link
            href="/login"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <span>{t.cta.button}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Dokument Chat</span>
              </div>
              <p className="text-gray-400">{t.footer.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t.footer.product}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footer.features}
                  </a>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        ?.getElementById("pricing")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="hover:text-white transition-colors"
                  >
                    {t.footer.pricing}
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footer.api} {t.footer.comingSoon}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footer.documentation} {t.footer.comingSoon}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t.footer.company}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footer.about}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footer.careers}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footer.contact}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t.footer.support}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footer.privacyPolicy}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footer.termsOfService}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footer.status}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
