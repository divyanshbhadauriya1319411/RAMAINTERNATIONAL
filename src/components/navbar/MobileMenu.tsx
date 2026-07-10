"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  X,
  Heart,
  Hammer,
  Zap,
  Truck,
  Coffee,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

interface UserInfo {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  companyName?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo | null;
  scrolled: boolean;
  handleLogout: () => Promise<void>;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  scrolled,
  handleLogout,
}: MobileMenuProps) {
  const t = useTranslations("navbar");
  const pathname = usePathname();
  const [sectorsOpen, setSectorsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = drawerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Initial focus
      firstElement.focus();

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      window.addEventListener("keydown", handleTab);
      return () => window.removeEventListener("keydown", handleTab);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sectors = [
    { name: t("sectorHealthcare"), icon: Heart },
    { name: t("sectorConstruction"), icon: Hammer },
    { name: t("sectorOilGas"), icon: Zap },
    { name: t("sectorLogistics"), icon: Truck },
    { name: t("sectorHospitality"), icon: Coffee },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Drawer Container */}
      <motion.div
        ref={drawerRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="relative w-full max-w-sm h-full bg-white dark:bg-navy-950 shadow-2xl flex flex-col z-10 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Header / Brand info */}
        <div className="p-6 border-b border-navy-900/5 dark:border-white/5 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex flex-col group whitespace-nowrap">
            <span className="font-headline text-lg font-extrabold tracking-tight text-navy-900 dark:text-white">
              RAMA <span className="text-gold-500">INTERNATIONAL-INDIA</span>
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] font-medium text-navy-700/60 dark:text-gray-400">
              Global Manpower Consultancy
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-navy-900 dark:text-gray-400 dark:hover:text-white cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 p-6 space-y-4 text-sm font-bold uppercase tracking-wider">
          <Link
            href="/"
            onClick={onClose}
            className="block py-2.5 border-b border-navy-900/5 dark:border-white/5 text-navy-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            {t("home")}
          </Link>

          <Link
            href="/about"
            onClick={onClose}
            className="block py-2.5 border-b border-navy-900/5 dark:border-white/5 text-navy-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            {t("about")}
          </Link>

          {/* Sectors Accordion */}
          <div className="border-b border-navy-900/5 dark:border-white/5 py-1">
            <button
              onClick={() => setSectorsOpen(!sectorsOpen)}
              className="w-full flex items-center justify-between py-2 text-left text-navy-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-500 transition-colors font-bold uppercase tracking-wider cursor-pointer"
              aria-expanded={sectorsOpen}
            >
              <span>{t("sectorsTitle")}</span>
              {sectorsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {sectorsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-4 mt-2 space-y-3 normal-case font-medium"
              >
                {sectors.map((sec, idx) => {
                  const Icon = sec.icon;
                  return (
                    <Link
                      key={idx}
                      href="/services"
                      onClick={onClose}
                      className="flex items-center space-x-3 py-1.5 text-navy-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-blue-500" />
                      <span className="text-xs">{sec.name}</span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </div>

          <Link
            href="/services"
            onClick={onClose}
            className="block py-2.5 border-b border-navy-900/5 dark:border-white/5 text-navy-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            {t("services")}
          </Link>

          <Link
            href="/jobs"
            onClick={onClose}
            className="block py-2.5 border-b border-navy-900/5 dark:border-white/5 text-navy-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            {t("jobs")}
          </Link>

          <Link
            href="/contact"
            onClick={onClose}
            className="block py-2.5 border-b border-navy-900/5 dark:border-white/5 text-navy-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            {t("contact")}
          </Link>

          {/* Theme & Language Controls */}
          <div className="pt-6 space-y-4">
            <ThemeToggle isMobile className="border-navy-900/10 dark:border-white/10 text-navy-900 dark:text-white" />

            <div className="flex items-center justify-between py-2 border-t border-navy-900/5 dark:border-white/5">
              <span className="text-navy-900 dark:text-gray-300 font-bold uppercase tracking-wider text-xs">Language / भाषा</span>
              <LanguageSwitcher
                onChangeLanguage={onClose}
                activeClass="bg-blue-600 text-white shadow-md"
                inactiveClass="text-navy-900 dark:text-gray-300 hover:bg-navy-900/5 dark:hover:bg-white/5"
                buttonClass="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center"
              />
            </div>
          </div>
        </nav>

        {/* Footer CTAs / Account */}
        <div className="p-6 border-t border-navy-900/5 dark:border-white/5 bg-navy-50/50 dark:bg-navy-950/50">
          {user ? (
            <div className="space-y-3">
              <div className="text-xs text-navy-500 dark:text-gray-400 font-medium">
                Signed in as <strong className="text-navy-900 dark:text-white">{user.fullName || user.companyName || user.email}</strong>
              </div>
              <Link
                href={
                  user.role === "ADMIN"
                    ? "/dashboard/admin"
                    : user.role === "EMPLOYER"
                      ? "/dashboard/employer"
                      : "/dashboard/candidate"
                }
                onClick={onClose}
                className="w-full flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all text-center"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={async () => {
                  onClose();
                  await handleLogout();
                }}
                className="w-full flex items-center justify-center py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 font-bold text-center">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full py-3 border border-navy-900/20 dark:border-white/20 text-navy-900 dark:text-white rounded-xl text-xs hover:bg-navy-900/5 dark:hover:bg-white/5 transition-all text-center"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs shadow-md transition-all text-center"
              >
                {t("apply")}
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
