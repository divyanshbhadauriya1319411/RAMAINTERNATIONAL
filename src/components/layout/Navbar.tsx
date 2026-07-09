"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Briefcase,
  Compass,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Heart,
  Hammer,
  Truck,
  Zap,
  Coffee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

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
  const { theme, toggleTheme } = useTheme();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

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
    { name: "Healthcare & Clinicians", icon: Heart, desc: "Specialist doctors, staff nurses, lab techs" },
    { name: "Construction & Infrastructure", icon: Hammer, desc: "Structural engineers, estimators, surveyors" },
    { name: "Oil, Gas & Energy Board", icon: Zap, desc: "Petrochemical technicians, pipe fitters, operators" },
    { name: "Logistics & Fleet Ops", icon: Truck, desc: "Heavy drivers, dispatchers, yard managers" },
    { name: "Hospitality & Tourism", icon: Coffee, desc: "Executive chefs, hotel managers, F&B boards" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-navy-950/90 backdrop-blur-md shadow-enterprise border-b border-navy-900/5 dark:border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex flex-col group">
                <span
                  className={`font-headline text-lg sm:text-xl font-extrabold tracking-tight transition-colors ${
                    scrolled
                      ? "text-navy-900 dark:text-white"
                      : "text-white"
                  }`}
                >
                  RAMA <span className="text-gold-500">INTERNATIONAL</span>
                </span>
                <span
                  className={`text-[8px] uppercase tracking-[0.25em] font-medium -mt-1 transition-colors ${
                    scrolled
                      ? "text-navy-700/60 dark:text-gray-400"
                      : "text-gray-300/80"
                  }`}
                >
                  Global Manpower Consultancy
                </span>
              </Link>
            </div>

            {/* Navigation links */}
            <nav className="hidden xl:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
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
                  className={`flex items-center space-x-1 cursor-pointer transition-colors duration-200 uppercase font-bold py-1.5 ${
                    scrolled
                      ? "text-navy-750 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
                      : "text-white/90 hover:text-gold-500"
                  }`}
                >
                  <span>Sectors</span>
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
                { name: "Services", href: "/services" },
                { name: "Current Jobs", href: "/jobs" },
                { name: "Contact", href: "/contact" },
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

            {/* Utility and Actions */}
            <div className="hidden xl:flex items-center space-x-4">
              
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

              {/* Theme Toggler */}
              <button
                onClick={toggleTheme}
                className={`p-2 cursor-pointer transition-colors ${
                  scrolled ? "text-navy-750 dark:text-gray-300 hover:text-blue-600" : "text-gray-300 hover:text-gold-500"
                }`}
                aria-label="Toggle layout color mode"
              >
                {theme === "dark" ? <Sun className="h-4.5 w-4.5 text-gold-500" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

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
                          <p className="font-bold text-[9px] uppercase tracking-wider text-blue-500 font-sans">Tier: {user.role}</p>
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
                          <span>Go to Dashboard</span>
                        </Link>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center space-x-2.5 px-4.5 py-3 text-red-500 hover:bg-red-500/5 text-left transition-colors font-semibold cursor-pointer border-t border-navy-900/5 dark:border-white/5"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                  <Link
                    href="/login"
                    className={`transition-colors py-2 px-3 hover:text-blue-600 ${
                      scrolled ? "text-navy-750 dark:text-gray-300" : "text-white/90"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={`px-5 py-2.5 rounded-full shadow-md hover:scale-[1.05] active:scale-95 transition-all duration-300 cursor-pointer font-bold ${
                      scrolled
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10"
                        : "bg-white hover:bg-gray-100 text-navy-900 shadow-white/5"
                    }`}
                  >
                    Apply Now
                  </Link>
                </div>
              )}

            </div>

            {/* Mobile menu triggers */}
            <div className="xl:hidden flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className={`p-1.5 cursor-pointer ${
                  scrolled ? "text-navy-750 dark:text-gray-300" : "text-gray-300"
                }`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4 text-gold-500" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-1.5 cursor-pointer border rounded-lg transition-colors ${
                  scrolled
                    ? "border-navy-900/20 text-navy-900 dark:border-white/20 dark:text-white"
                    : "border-white/25 text-white"
                }`}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`xl:hidden mt-3 border-t overflow-hidden text-xs font-bold uppercase tracking-wider ${
                scrolled
                  ? "bg-white border-navy-900/5 dark:bg-navy-950 dark:border-white/5"
                  : "bg-navy-900 border-white/10"
              }`}
            >
              <div className="p-4 space-y-2">
                {[
                  { name: "Home", href: "/" },
                  { name: "About Us", href: "/about" },
                  { name: "Services", href: "/services" },
                  { name: "Job Board", href: "/jobs" },
                  { name: "Contact", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block p-3 rounded-xl transition-all ${
                      scrolled
                        ? "text-navy-750 dark:text-gray-300 hover:bg-navy-900/5 dark:hover:bg-white/5"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-4 border-t border-navy-900/5 dark:border-white/5 flex flex-col gap-3 font-bold text-center">
                  {user ? (
                    <Link
                      href={user.role === "ADMIN" ? "/dashboard/admin" : user.role === "EMPLOYER" ? "/dashboard/employer" : "/dashboard/candidate"}
                      onClick={() => setMenuOpen(false)}
                      className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl shadow-md transition-all"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className={`py-2 transition-colors ${
                          scrolled ? "text-navy-750 dark:text-gray-300" : "text-gray-300"
                        }`}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMenuOpen(false)}
                        className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl border border-blue-500/20 shadow-md font-bold"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

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
              <h3 className="font-headline text-sm font-extrabold text-blue-600 tracking-wider mb-4 uppercase">Search Global Vacancies</h3>
              <form onSubmit={handleSearchSubmit} className="flex gap-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrician, Welding, Qatar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-navy-900/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 font-medium"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border border-blue-500/20 transition-colors"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
