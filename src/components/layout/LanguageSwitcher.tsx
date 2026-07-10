"use client";

import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
  activeClass?: string;
  inactiveClass?: string;
  buttonClass?: string;
}

export default function LanguageSwitcher({
  className = "",
  activeClass = "bg-blue-600 text-white shadow-md",
  inactiveClass = "text-navy-900 dark:text-gray-300 hover:bg-navy-900/5 dark:hover:bg-white/5",
  buttonClass = "px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg"
}: LanguageSwitcherProps) {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className={`flex items-center bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 rounded-xl overflow-hidden p-0.5 ${className}`}>
      <button
        onClick={() => changeLanguage("en")}
        className={`${buttonClass} transition-all duration-200 cursor-pointer ${
          language === "en" ? activeClass : inactiveClass
        }`}
        title="English"
      >
        EN
      </button>

      <button
        onClick={() => changeLanguage("hi")}
        className={`${buttonClass} transition-all duration-200 cursor-pointer ${
          language === "hi" ? activeClass : inactiveClass
        }`}
        title="हिन्दी"
      >
        हिन्दी
      </button>
    </div>
  );
}
