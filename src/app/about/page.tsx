"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslations } from "next-intl";
import { User, Landmark, Award, ShieldAlert, CheckCircle, Mail, MapPin } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-navy-950 text-navy-900 dark:text-white transition-colors duration-200 overflow-x-hidden">
      <Navbar />

      {/* Page Header */}
      <section className="bg-[#051B3D] text-white py-20 text-center relative overflow-hidden border-b-2 border-gold-500">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-wider">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
            {t("desc")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* Founder & Vision */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-gold-500/10 border border-gold-500/30 px-3 py-1 rounded text-gold-500 text-xs font-semibold uppercase tracking-wider">
              {t("milestoneTag")}
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white leading-tight">
              {t("milestoneTitle")}
            </h2>
            <div className="w-12 h-1 bg-gold-500" />
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-350 leading-relaxed font-light">
              {t("milestoneDesc1")}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-350 leading-relaxed font-light">
              {t("milestoneDesc2")}
            </p>
            <div className="border-l-4 border-gold-500 pl-4 bg-slate-50 dark:bg-navy-900/40 p-4 rounded-r-lg">
              <p className="text-xs text-navy-900 dark:text-gray-250 italic font-medium leading-relaxed">
                {t("founderQuote")}
              </p>
              <p className="text-xs text-gold-600 dark:text-gold-400 font-bold mt-2 uppercase tracking-wide">— Deepak Chauhan, Founder & MD</p>
            </div>
          </div>

          {/* Profile Visual Card */}
          <div className="bg-navy-900 rounded-2xl border border-gold-500/25 p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="font-headline text-lg font-bold text-gold-500 mb-6 tracking-wide">{t("milestoneHeader")}</h3>
            <div className="space-y-6 text-xs font-light">
              <div className="flex items-start space-x-3.5">
                <div className="h-7 w-7 rounded bg-navy-800 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-sm">{t("y2018Title")}</h4>
                  <p className="text-gray-400 mt-1 leading-relaxed">{t("y2018Desc")}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="h-7 w-7 rounded bg-navy-800 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-sm">{t("y2020Title")}</h4>
                  <p className="text-gray-400 mt-1 leading-relaxed">{t("y2020Desc")}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="h-7 w-7 rounded bg-navy-800 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-sm">{t("y2023Title")}</h4>
                  <p className="text-gray-400 mt-1 leading-relaxed">{t("y2023Desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Values */}
        <section className="bg-slate-50 dark:bg-navy-900/10 rounded-2xl border border-gray-150 dark:border-white/5 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="font-headline text-2xl font-bold text-navy-900 dark:text-white">{t("pillarsTitle")}</h2>
            <div className="w-8 h-0.5 bg-gold-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-xs">
            <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 p-6 rounded-xl space-y-3 shadow-sm text-navy-900 dark:text-white">
              <Landmark className="h-8 w-8 text-gold-500 mx-auto" />
              <h3 className="font-bold text-sm text-navy-900 dark:text-white">{t("pillar1Title")}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">{t("pillar1Desc")}</p>
            </div>
            <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 p-6 rounded-xl space-y-3 shadow-sm text-navy-900 dark:text-white">
              <Award className="h-8 w-8 text-gold-500 mx-auto" />
              <h3 className="font-bold text-sm text-navy-900 dark:text-white">{t("pillar2Title")}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">{t("pillar2Desc")}</p>
            </div>
            <div className="bg-white dark:bg-navy-900/40 border border-gray-200 dark:border-white/5 p-6 rounded-xl space-y-3 shadow-sm text-navy-900 dark:text-white">
              <User className="h-8 w-8 text-gold-500 mx-auto" />
              <h3 className="font-bold text-sm text-navy-900 dark:text-white">{t("pillar3Title")}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">{t("pillar3Desc")}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
