"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Hammer,
  Zap,
  Truck,
  Coffee,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MobileMenu from "./MobileMenu";

interface UserInfo {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  companyName?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const t = useTranslations("navbar");

  useEffect(() => {
    fetchUser();

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Check initial scroll position
    if (window.scrollY > 20) {
      setScrolled(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/login", { method: "DELETE" });
      if (res.ok) {
        setUser(null);
        router.push("/login");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const sectors = [
    { name: t("sectorHealthcare"), icon: Heart, desc: t("sectorHealthcareDesc") },
    { name: t("sectorConstruction"), icon: Hammer, desc: t("sectorConstructionDesc") },
    { name: t("sectorOilGas"), icon: Zap, desc: t("sectorOilGasDesc") },
    { name: t("sectorLogistics"), icon: Truck, desc: t("sectorLogisticsDesc") },
    { name: t("sectorHospitality"), icon: Coffee, desc: t("sectorHospitalityDesc") },
  ];

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 flex items-center ${
          scrolled
            ? "bg-white/90 dark:bg-navy-950/90 backdrop-blur-md shadow-enterprise border-b border-navy-900/5 dark:border-white/5 h-20 xl:h-[88px]"
            : "bg-transparent h-20 xl:h-[88px]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-8 w-full h-full flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center min-w-[280px] lg:min-w-[320px] justify-start mr-[48px] xl:mr-[64px]">
            <Link href="/" className="flex flex-col group whitespace-nowrap">
              <span
                className={`font-headline text-lg sm:text-xl font-extrabold tracking-tight transition-colors ${
                  scrolled
                    ? "text-navy-900 dark:text-white"
                    : "text-white"
                }`}
              >
                RAMA <span className="text-gold-500">INTERNATIONAL-INDIA</span>
              </span>
              <span
                className={`text-[8px] uppercase tracking-[0.25em] font-medium -mt-1 transition-colors ${
                  scrolled
                    ? "text-navy-770/60 dark:text-gray-400"
                    : "text-gray-300/80"
                }`}
              >
                Global Manpower Consultancy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <DesktopNav
            scrolled={scrolled}
            megaMenuOpen={megaMenuOpen}
            setMegaMenuOpen={setMegaMenuOpen}
            sectors={sectors}
            user={user}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            handleLogout={handleLogout}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
          />

          {/* Mobile Navigation Trigger controls */}
          <MobileNav
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            scrolled={scrolled}
          />

        </div>

      </header>

      {/* Responsive Drawer Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            user={user}
            scrolled={scrolled}
            handleLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              exit={{ y: -30 }}
              className="bg-white dark:bg-navy-950 border border-navy-900/5 dark:border-white/5 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-navy-900 dark:hover:text-white cursor-pointer font-bold"
              >
                ✕
              </button>
              <h3 className="font-headline text-sm font-extrabold text-blue-600 tracking-wider mb-4 uppercase">{t("searchTitle")}</h3>
              <form onSubmit={handleSearchSubmit} className="flex gap-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-navy-900/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 font-medium"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border border-blue-500/20 transition-colors"
                >
                  {t("searchBtn")}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
