"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DashboardGate() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const t = useTranslations("dashboardCommon");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        const role = data.user.role;
        
        if (role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (role === "EMPLOYER") {
          router.push("/dashboard/employer");
        } else if (role === "CANDIDATE") {
          router.push("/dashboard/candidate");
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    } catch (e) {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-luxury-light dark:bg-navy-950 text-navy-900 dark:text-white transition-colors duration-200 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 text-navy-900">
        <div className="flex items-center space-x-3 text-xs font-semibold">
          <RefreshCw className="h-5 w-5 animate-spin text-gold-500" />
          <span>{t("routingMessage")}</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
