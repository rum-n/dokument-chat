import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get language from localStorage, default to 'en'
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || "en";
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "bg" : "en"));
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isEnglish: language === "en",
    isBulgarian: language === "bg",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
