"use client";

import Link from "next/link";
import { Compass, LogOut, Search, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

interface UserInfo {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  companyName?: string;
}

interface DesktopNavProps {
  scrolled: boolean;
  megaMenuOpen: boolean;
  setMegaMenuOpen: (open: boolean) => void;
  sectors: any[];
  user: UserInfo | null;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  handleLogout: () => Promise<void>;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export default function DesktopNav({
  scrolled,
  megaMenuOpen,
  setMegaMenuOpen,
  sectors,
  user,
  dropdownOpen,
  setDropdownOpen,
  handleLogout,
  searchOpen,
  setSearchOpen,
}: DesktopNavProps) {
  const t = useTranslations("navbar");

  return (
    <>
      {/* Navigation links (Centered horizontally) */}
      <nav className="hidden xl:flex items-center justify-center flex-grow space-x-8 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
        {[
          { name: t("home"), href: "/" },
          { name: t("about"), href: "/about" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`transition-colors duration-200 relative group py-1.5 ${
              scrolled
                ? "text-navy-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
                : "text-white/90 hover:text-gold-500"
            }`}
          >
            {item.name}
            <span
              className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                scrolled ? "bg-blue-600" : "bg-gold-500"
              }`}
            ></span>
          </Link>
        ))}

        {/* Sectors Mega Menu Toggle */}
        <div
          className="relative"
          onMouseEnter={() => setMegaMenuOpen(true)}
          onMouseLeave={() => setMegaMenuOpen(false)}
        >
          <button
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            className={`flex items-center space-x-1 cursor-pointer transition-colors duration-200 uppercase font-bold py-1.5 ${
              scrolled
                ? "text-navy-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
                : "text-white/90 hover:text-gold-500"
            }`}
          >
            <span>{t("sectorsTitle")}</span>
            <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {megaMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`absolute left-0 mt-3 w-80 rounded-2xl shadow-2xl p-4 border ${
                  scrolled
                    ? "bg-white border-navy-900/5 dark:bg-navy-950 dark:border-white/5"
                    : "bg-navy-900/95 backdrop-blur-md border-white/10"
                }`}
              >
                <div className="space-y-3">
                  {sectors.map((sec, idx) => {
                    const Icon = sec.icon;
                    return (
                      <Link
                        key={idx}
                        href="/services"
                        className={`flex items-start space-x-3.5 p-2 rounded-xl group transition-all duration-200 ${
                          scrolled
                            ? "hover:bg-navy-900/5 dark:hover:bg-white/5"
                            : "hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg border text-blue-500 group-hover:border-blue-600 transition-colors ${
                            scrolled
                              ? "bg-navy-900/5 border-navy-900/10 dark:bg-white/5 dark:border-white/10"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4
                            className={`font-bold text-[11px] transition-colors ${
                              scrolled
                                ? "text-navy-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500"
                                : "text-white group-hover:text-gold-500"
                            }`}
                          >
                            {sec.name}
                          </h4>
                          <p
                            className={`text-[10px] font-light mt-0.5 normal-case leading-normal ${
                              scrolled ? "text-navy-700/60 dark:text-gray-400" : "text-gray-400"
                            }`}
                          >
                            {sec.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {[
          { name: t("services"), href: "/services" },
          { name: t("jobs"), href: "/jobs" },
          { name: t("contact"), href: "/contact" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`transition-colors duration-200 relative group py-1.5 ${
              scrolled
                ? "text-navy-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
                : "text-white/90 hover:text-gold-500"
            }`}
          >
            {item.name}
            <span
              className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                scrolled ? "bg-blue-600" : "bg-gold-500"
              }`}
            ></span>
          </Link>
        ))}
      </nav>

      {/* Right Controls (Pushed to the right, consistent spacing) */}
      <div className="hidden xl:flex items-center space-x-[20px] justify-end flex-shrink-0">
        {/* Search Trigger */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className={`p-2 cursor-pointer transition-colors ${
            scrolled ? "text-navy-750 dark:text-gray-300 hover:text-blue-600" : "text-gray-300 hover:text-gold-500"
          }`}
          aria-label="Search jobs"
        >
          <Search className="h-4.5 w-4.5" />
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggler */}
        <ThemeToggle
          className={
            scrolled ? "text-navy-750 dark:text-gray-300 hover:text-blue-600" : "text-gray-300 hover:text-gold-500"
          }
        />

        {/* Auth Panel CTAs */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center space-x-2 border px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                scrolled
                  ? "bg-navy-900/5 dark:bg-white/5 border-navy-900/10 dark:border-white/10 text-navy-900 dark:text-white hover:bg-navy-900/10"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <User className="h-3.5 w-3.5 text-blue-500" />
              <span className="max-w-[100px] truncate">{user.fullName || user.companyName || user.email}</span>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute right-0 mt-2.5 w-52 rounded-2xl shadow-2xl border overflow-hidden text-xs ${
                    scrolled
                      ? "bg-white border-navy-900/5 dark:bg-navy-950 dark:border-white/5 text-navy-900 dark:text-white"
                      : "bg-navy-900 border-white/10 text-white"
                  }`}
                >
                  <div className={`p-3.5 border-b text-gray-400 ${
                    scrolled ? "bg-navy-900/5 border-navy-900/5 dark:bg-white/5" : "bg-navy-955/40 border-white/10"
                  }`}>
                    <p className="font-bold text-[9px] uppercase tracking-wider text-blue-500 font-sans">{t("tierLabel")}: {user.role}</p>
                    <p className="truncate mt-0.5 font-sans font-light">{user.email}</p>
                  </div>
                  <Link
                    href={
                      user.role === "ADMIN"
                        ? "/dashboard/admin"
                        : user.role === "EMPLOYER"
                          ? "/dashboard/employer"
                          : "/dashboard/candidate"
                    }
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center space-x-2.5 px-4.5 py-3 transition-colors font-semibold ${
                      scrolled ? "hover:bg-navy-900/5 dark:hover:bg-white/5" : "hover:bg-white/10"
                    }`}
                  >
                    <Compass className="h-4 w-4 text-blue-500" />
                    <span>{t("dashboardLink")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-2.5 px-4.5 py-3 text-red-500 hover:bg-red-500/5 text-left transition-colors font-semibold cursor-pointer border-t border-navy-900/5 dark:border-white/5"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("signOutBtn")}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center space-x-[20px] text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            <Link
              href="/login"
              className={`transition-colors py-2 px-3 hover:text-blue-600 ${
                scrolled ? "text-navy-750 dark:text-gray-300" : "text-white/90"
              }`}
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className={`px-5 py-2.5 rounded-full shadow-md hover:scale-[1.05] active:scale-95 transition-all duration-300 cursor-pointer font-bold ${
                scrolled
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10"
                  : "bg-white hover:bg-gray-100 text-navy-900 shadow-white/5"
              }`}
            >
              {t("apply")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
