"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { KeyRound, Mail, RefreshCw, LogIn, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch (e) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-luxury-light dark:bg-navy-950 text-navy-900 dark:text-white transition-colors duration-200 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 rounded-xl p-8 max-w-md w-full shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-headline text-2xl font-bold text-navy-900 dark:text-white tracking-wide">
              {t("loginWelcome")}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
              {t("loginDesc")}
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-750 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-navy-900 dark:text-white font-medium">
            <div>
              <label className="block text-gray-500 dark:text-gray-400 font-semibold mb-1">{t("fieldEmail")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholderEmail")}
                  className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-gold-500 transition-colors text-navy-900 dark:text-white font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-gray-500 dark:text-gray-400 font-semibold">{t("fieldPassword")}</label>
                <Link href="#" className="text-[10px] text-gold-600 dark:text-gold-450 hover:underline">
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("placeholderPassword")}
                  className="w-full bg-luxury-light dark:bg-navy-950 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-gold-500 transition-colors text-navy-900 dark:text-white font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold uppercase tracking-wider py-4 rounded-lg flex items-center justify-center space-x-2 text-xs shadow-lg hover:shadow-gold-500/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>{t("loginBtn")}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Mock Login Assistance */}
          <div className="bg-navy-900 border border-gold-500/15 text-[10px] rounded-lg p-3 text-white space-y-1">
            <p className="text-gold-400 font-bold uppercase tracking-wider">{t("demoTitle")}</p>
            <p><span className="text-gray-450 font-semibold">Admin:</span> admin@ramainternational.in / Password123!</p>
            <p><span className="text-gray-455 font-semibold">Candidate:</span> rahul.sharma@gmail.com / Password123!</p>
            <p><span className="text-gray-455 font-semibold">Employer:</span> recruitment@almarai.com / Password123!</p>
          </div>

          <div className="text-center text-[11px] text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-150 dark:border-white/5">
            <span>{t("noAccount")} </span>
            <Link href="/register" className="text-gold-600 dark:text-gold-450 hover:underline font-semibold inline-flex items-center">
              <span>{t("registerLink")}</span>
              <ArrowRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
