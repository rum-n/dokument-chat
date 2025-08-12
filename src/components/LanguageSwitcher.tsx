"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage, Language } from "../contexts/LanguageContext";
import { translations } from "../translations";

const LanguageSwitcher = (): React.JSX.Element => {
	const { language, setLanguage } = useLanguage();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent): void => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLanguageChange = (newLanguage: Language): void => {
		setLanguage(newLanguage);
		setIsOpen(false);
	};

	const currentLanguage = language === "en" ? "English" : "Български";
	const currentFlag = language === "en" ? "🇺🇸" : "🇧🇬";

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md transition-colors"
			>
				<Globe className="w-4 h-4" />
				<span>{currentFlag}</span>
				<span className="hidden sm:inline">{currentLanguage}</span>
				<ChevronDown
					className={`w-4 h-4 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
					<div className="py-1">
						<button
							onClick={() => handleLanguageChange("en")}
							className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
								language === "en" ? "bg-blue-50 text-blue-600" : "text-gray-700"
							}`}
						>
							<span>🇺🇸</span>
							<span>English</span>
						</button>
						<button
							onClick={() => handleLanguageChange("bg")}
							className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
								language === "bg" ? "bg-blue-50 text-blue-600" : "text-gray-700"
							}`}
						>
							<span>🇧🇬</span>
							<span>Български</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default LanguageSwitcher;
