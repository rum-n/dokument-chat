"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "bg";

interface LanguageContextType {
	language: Language;
	setLanguage: (language: Language) => void;
	toggleLanguage: () => void;
	isEnglish: boolean;
	isBulgarian: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};

interface LanguageProviderProps {
	children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
	const [language, setLanguage] = useState<Language>("en");

	useEffect(() => {
		// Initialize language from localStorage on client side
		const savedLanguage = localStorage.getItem("language");
		if (savedLanguage && (savedLanguage === "en" || savedLanguage === "bg")) {
			setLanguage(savedLanguage as Language);
		}
	}, []);

	useEffect(() => {
		// Save language preference to localStorage
		localStorage.setItem("language", language);
	}, [language]);

	const toggleLanguage = () => {
		setLanguage((prev: Language) => (prev === "en" ? "bg" : "en"));
	};

	const value: LanguageContextType = {
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
