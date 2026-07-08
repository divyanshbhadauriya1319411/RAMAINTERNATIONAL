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
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Building,
  Heart,
  Hammer,
  Truck,
  Zap,
  Coffee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.remove("dark-mode");
      setIsDarkMode(false);
    } else {
      root.classList.add("dark-mode");
      setIsDarkMode(true);
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
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-navy-950/95 shadow-lg border-b border-gold-500/20 py-4"
            : "bg-transparent py-6"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex flex-col group">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-widest text-gold-500 group-hover:text-gold-400 transition-colors">
                  RAMA INTERNATIONAL-INDIA
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-gray-300 font-sans -mt-1 group-hover:text-gold-300/80 transition-colors">
                  Global Manpower Consultancy
                </span>
              </Link>
            </div>

            {/* Navigation links */}
            <nav className="hidden xl:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider">
              <Link href="/" className="text-gray-300 hover:text-gold-400 transition-colors">
                Home
              </Link>
              
              <Link href="/about" className="text-gray-300 hover:text-gold-400 transition-colors">
                About Us
              </Link>

              {/* Services Mega Menu Toggle */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button className="flex items-center space-x-1 text-gray-300 hover:text-gold-400 cursor-pointer transition-colors uppercase font-semibold">
                  <span>Sectors We Serve</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-3 w-80 bg-navy-950 border border-gold-500/20 rounded-xl shadow-2xl p-5"
                    >
                      <div className="space-y-4">
                        {sectors.map((sec, idx) => {
                          const Icon = sec.icon;
                          return (
                            <Link
                              key={idx}
                              href="/services"
                              className="flex items-start space-x-3.5 p-2 rounded-lg hover:bg-navy-900 group transition-all"
                            >
                              <div className="p-2 bg-navy-900 border border-gold-500/10 text-gold-500 rounded group-hover:border-gold-500/30">
                                <Icon className="h-4.5 w-4.5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-[11px] text-gray-200 group-hover:text-gold-400 transition-colors">
                                  {sec.name}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-light mt-0.5 normal-case">
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

              <Link href="/services" className="text-gray-300 hover:text-gold-400 transition-colors">
                Services
              </Link>
              
              <Link href="/jobs" className="text-gray-300 hover:text-gold-400 transition-colors">
                Current Jobs
              </Link>

              <Link href="/contact" className="text-gray-300 hover:text-gold-400 transition-colors">
                Contact
              </Link>
            </nav>

            {/* Utility and Actions */}
            <div className="hidden xl:flex items-center space-x-4">
              
              {/* Search Drawer Trigger */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-300 hover:text-gold-500 cursor-pointer transition-colors"
                aria-label="Search jobs"
              >
                <Search className="h-4.5 w-4.5" />
              </button>

              {/* Theme Toggler */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-300 hover:text-gold-500 cursor-pointer transition-colors"
                aria-label="Toggle layout color mode"
              >
                {isDarkMode ? <Sun className="h-4.5 w-4.5 text-gold-500" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              {/* Auth Panel CTAs */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 bg-navy-900 border border-gold-500/25 px-4.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-navy-800 transition-colors cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5 text-gold-500" />
                    <span className="max-w-[100px] truncate">{user.fullName || user.companyName || user.email}</span>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2.5 w-52 bg-navy-950 border border-gold-500/20 rounded-xl shadow-xl overflow-hidden text-xs"
                      >
                        <div className="p-3.5 bg-navy-900 border-b border-gold-500/10 text-gray-400">
                          <p className="font-bold text-[9px] uppercase tracking-wider text-gold-500">Tier: {user.role}</p>
                          <p className="truncate mt-0.5">{user.email}</p>
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
                          className="flex items-center space-x-2.5 px-4.5 py-3 hover:bg-gold-500 hover:text-navy-950 transition-colors font-semibold"
                        >
                          <Compass className="h-4 w-4" />
                          <span>Go to Dashboard</span>
                        </Link>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center space-x-2.5 px-4.5 py-3 text-red-400 hover:bg-red-500/10 text-left transition-colors font-semibold cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3.5 text-xs font-bold uppercase tracking-wider">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-gold-400 transition-colors py-2 px-3"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 px-5 py-2.5 rounded-lg shadow-md transition-all cursor-pointer font-semibold"
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
                className="p-1.5 text-gray-300 hover:text-gold-500 cursor-pointer"
              >
                {isDarkMode ? <Sun className="h-4 w-4 text-gold-500" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-gray-300 hover:text-gold-500 cursor-pointer border border-gold-500/25 rounded"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu links drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden bg-navy-950 border-t border-gold-500/20 mt-4 overflow-hidden text-xs font-semibold uppercase tracking-wider"
            >
              <div className="p-4 space-y-2.5">
                {[
                  { name: "Home", href: "/" },
                  { name: "About Us", href: "/about" },
                  { name: "Services Directory", href: "/services" },
                  { name: "Job Board", href: "/jobs" },
                  { name: "Contact Liaison", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block p-3 rounded-lg text-gray-300 hover:bg-navy-900 hover:text-gold-400"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-4 border-t border-gold-500/10 flex flex-col gap-3 font-bold text-center">
                  {user ? (
                    <Link
                      href={user.role === "ADMIN" ? "/dashboard/admin" : user.role === "EMPLOYER" ? "/dashboard/employer" : "/dashboard/candidate"}
                      onClick={() => setMenuOpen(false)}
                      className="bg-navy-900 border border-gold-500/30 text-gold-500 py-3 rounded-lg"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-300 py-2"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMenuOpen(false)}
                        className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 py-3 rounded-lg"
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

      {/* Global Search Drawer Overlay Overlay */}
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
              className="bg-navy-950 border border-gold-500/25 rounded-xl max-w-xl w-full p-5 shadow-2xl text-white relative"
            >
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
              <h3 className="font-serif text-sm font-bold text-gold-500 tracking-wider mb-4 uppercase">Search Global Vacancies</h3>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrician, Welding, Qatar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-navy-900 border border-gold-500/20 rounded-lg px-4 py-2.5 text-xs text-white outline-none focus:border-gold-500"
                />
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
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
