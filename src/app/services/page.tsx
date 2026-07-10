"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Users,
  Briefcase,
  Globe,
  Award,
  TrendingUp,
  Activity,
  ShieldCheck,
  Landmark,
  Plane,
  Heart,
  Hammer,
  Truck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function ServicesDirectoryPage() {
  const t = useTranslations("servicesPage");

  const SERVICES_LIST = [
    {
      slug: "permanent-recruitment",
      title: "Permanent Recruitment",
      desc: "Long-term staffing solutions connecting your organization with high-caliber Indian professionals.",
      icon: Users,
    },
    {
      slug: "temporary-staffing",
      title: "Temporary Staffing",
      desc: "Flexible, short-term personnel solutions to handle sudden workloads and project expansions.",
      icon: Activity,
    },
    {
      slug: "executive-search",
      title: "Executive Search",
      desc: "C-suite and senior leadership headhunting for critical healthcare, engineering, and energy boards.",
      icon: Award,
    },
    {
      slug: "bulk-hiring",
      title: "Bulk Hiring",
      desc: "Large-scale mobilization campaigns for heavy industries, including testing and stamping.",
      icon: TrendingUp,
    },
    {
      slug: "international-recruitment",
      title: "International Recruitment",
      desc: "Bridging the gap between domestic Indian skills and global corporations.",
      icon: Globe,
    },
    {
      slug: "overseas-placement",
      title: "Overseas Placement",
      desc: "Guiding Indian candidates through overseas deployments, medical checks, and visa gates.",
      icon: Plane,
    },
    {
      slug: "payroll-management",
      title: "Payroll Management",
      desc: "Streamlined salary distribution, compliance checks, and welfare management for mobilizations.",
      icon: Landmark,
    },
    {
      slug: "hr-consultancy",
      title: "HR Consultancy",
      desc: "Advising global partners on salary benchmarking, MEA clearances, and labor compliance.",
      icon: ShieldCheck,
    },
    {
      slug: "contract-staffing",
      title: "Contract Staffing",
      desc: "Structured contractor supply pipelines with defined periods and output verification.",
      icon: Briefcase,
    },
    {
      slug: "blue-collar-hiring",
      title: "Blue Collar Hiring",
      desc: "Sourcing certified welders, electrical techs, riggers, and pipe fitters.",
      icon: Hammer,
    },
    {
      slug: "white-collar-hiring",
      title: "White Collar Hiring",
      desc: "Sourcing clinicians, designers, estimators, accounting boards, and tech coordinators.",
      icon: Heart,
    },
    {
      slug: "skilled-labour-supply",
      title: "Skilled Labour Supply",
      desc: "Sourcing highly-qualified technicians backed by rigorous physical trade testing grades.",
      icon: Truck,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-white font-sans transition-colors duration-200 overflow-x-hidden">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#051B3D] text-white py-24 text-center relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-600/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest font-headline">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" />
            <span>{t("tagline")}</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
            {t("desc")}
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_LIST.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.slug}
                className="bg-white dark:bg-navy-900/40 border border-gray-150 dark:border-white/5 rounded-[24px] p-8 shadow-enterprise hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/25 dark:hover:border-blue-500/25 transition-all duration-300 flex flex-col justify-between h-80 group text-navy-900 dark:text-white"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-blue-600/5 text-blue-650 rounded-xl flex items-center justify-center border border-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-base font-bold text-navy-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">{svc.desc}</p>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <Link
                    href={`/services/${svc.slug}`}
                    className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[10px] hover:underline"
                  >
                    <span>{t("readDetails")}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
