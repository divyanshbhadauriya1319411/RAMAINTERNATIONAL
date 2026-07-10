"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  isMobile?: boolean;
}

export default function ThemeToggle({ className = "", isMobile = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // SSR placeholder spacing
  }

  const isDark = theme === "dark";
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (isMobile) {
    return (
      <div className={`w-full bg-white dark:bg-navy-900 border border-gray-150 dark:border-white/10 rounded-2xl shadow-sm p-4 flex flex-col space-y-3.5 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold text-navy-900 dark:text-white uppercase tracking-wider">Appearance</span>
          <span className="text-[11px] text-gray-400 font-light uppercase tracking-wider">Theme / थीम</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-[13px] font-medium text-navy-900 dark:text-gray-200">
            <span className={`flex items-center space-x-1.5 transition-opacity duration-300 ${!isDark ? "opacity-100 font-semibold" : "opacity-50"}`}>
              <Sun className={`h-4 w-4 text-gold-500 transition-transform duration-300 ${!isDark ? "scale-110 rotate-12" : ""}`} />
              <span>Light / लाइट</span>
            </span>
            <span className={`flex items-center space-x-1.5 transition-opacity duration-300 ${isDark ? "opacity-100 font-semibold" : "opacity-50"}`}>
              <Moon className={`h-4 w-4 text-blue-500 transition-transform duration-300 ${isDark ? "scale-110 -rotate-12" : ""}`} />
              <span>Dark / डार्क</span>
            </span>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={toggleTheme}
            aria-label={`Toggle appearance mode. Currently in ${isDark ? "dark" : "light"} mode.`}
            className={`w-12 h-6.5 rounded-full p-1 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center ${
              !isDark
                ? "bg-white border-blue-600"
                : "bg-[#0B1F44] border-blue-600/40"
            }`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-full transition-transform duration-300 ${
                !isDark ? "bg-blue-600 translate-x-0" : "bg-white translate-x-5.5"
              }`}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 cursor-pointer transition-colors ${className}`}
      aria-label="Toggle layout color mode"
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-gold-500" />
      ) : (
        <Moon className="h-4.5 w-4.5" />
      )}
    </button>
  );
}
