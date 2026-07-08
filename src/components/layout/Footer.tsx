"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Landmark,
  Award,
  ShieldCheck,
  Send,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsSuccess, setNewsSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsSuccess(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-[#030E21] border-t border-gold-500/20 text-gray-300">
      
      {/* 1. Global Accreditations Banner */}
      <div className="bg-[#020C1B] border-b border-gold-500/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-navy-900 border border-gold-500/10 rounded-lg text-gold-500">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest">MEA Licensed Entity</h4>
              <p className="text-[11px] text-gray-400 mt-1 font-light leading-relaxed">
                Registered under License: **RC-B-0850/DEL/COM/1000+/5/9385/2018** with the Ministry of External Affairs, India.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-navy-900 border border-gold-500/10 rounded-lg text-gold-500">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest">ISO 9001:2015 Standards</h4>
              <p className="text-[11px] text-gray-400 mt-1 font-light leading-relaxed">
                Internationally certified operational frameworks for high-quality vocational screening and recruitment.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-navy-900 border border-gold-500/10 rounded-lg text-gold-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Verified Dossier Vault</h4>
              <p className="text-[11px] text-gray-400 mt-1 font-light leading-relaxed">
                All candidates' biometric data and certification logs are encrypted and verified securely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
        
        {/* Col 1: About & Registration Details */}
        <div className="lg:col-span-4 space-y-5">
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-widest text-gold-500">
              RAMA INTERNATIONAL-INDIA
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-sans -mt-0.5">
              Global Manpower Partner
            </span>
          </Link>
          <p className="text-[11px] text-gray-400 font-light leading-relaxed">
            Connecting leading multinational employers with pre-screened, certified Indian professionals. From interview sourcing to final consular visa stamping, we are your complete international workforce partner.
          </p>
          <div className="flex space-x-3 text-gray-400 pt-2">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-navy-900 border border-gold-500/15 rounded-lg hover:border-gold-500 hover:text-gold-500 transition-colors">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-navy-900 border border-gold-500/15 rounded-lg hover:border-gold-500 hover:text-gold-500 transition-colors">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-navy-900 border border-gold-500/15 rounded-lg hover:border-gold-500 hover:text-gold-500 transition-colors">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
          </div>
        </div>

        {/* Col 2: Services Directory */}
        <div className="lg:col-span-2.5 space-y-4">
          <h4 className="font-serif text-xs font-bold text-gold-500 uppercase tracking-widest">Sourcing Fields</h4>
          <ul className="space-y-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            <li><Link href="/services/permanent-recruitment" className="hover:text-gold-400 transition-colors">Permanent Sourcing</Link></li>
            <li><Link href="/services/bulk-hiring" className="hover:text-gold-400 transition-colors">Bulk Mobilizations</Link></li>
            <li><Link href="/services/executive-search" className="hover:text-gold-400 transition-colors">Executive Search</Link></li>
            <li><Link href="/services/skilled-labour-supply" className="hover:text-gold-400 transition-colors">Technical Technicians</Link></li>
            <li><Link href="/services/overseas-placement" className="hover:text-gold-400 transition-colors">Visa Stamping Desk</Link></li>
          </ul>
        </div>

        {/* Col 3: Regional Desks */}
        <div className="lg:col-span-2.5 space-y-4">
          <h4 className="font-serif text-xs font-bold text-gold-500 uppercase tracking-widest">Regional Desks</h4>
          <ul className="space-y-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            <li><Link href="/jobs" className="hover:text-gold-400 transition-colors">Saudi Arabia (KSA)</Link></li>
            <li><Link href="/jobs" className="hover:text-gold-400 transition-colors">United Arab Emirates</Link></li>
            <li><Link href="/jobs" className="hover:text-gold-400 transition-colors">State of Qatar</Link></li>
            <li><Link href="/jobs" className="hover:text-gold-400 transition-colors">Schengen Europe</Link></li>
            <li><Link href="/jobs" className="hover:text-gold-400 transition-colors">Singapore Desk</Link></li>
          </ul>
        </div>

        {/* Col 4: Contacts & Newsletter */}
        <div className="lg:col-span-3 space-y-5">
          <h4 className="font-serif text-xs font-bold text-gold-500 uppercase tracking-widest">Global Liaison</h4>
          <ul className="space-y-3 text-[11px] text-gray-400 font-light">
            <li className="flex items-start space-x-2.5">
              <MapPin className="h-4.5 w-4.5 text-gold-500 shrink-0 mt-0.5" />
              <span>Dwarka, New Delhi, 110075, India</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="h-4 w-4 text-gold-500 shrink-0" />
              <span>+91 11 4056 9385 / +91 98188 56000</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="h-4 w-4 text-gold-500 shrink-0" />
              <span>corporate@ramainternational.in</span>
            </li>
          </ul>

          {/* Quick WhatsApp Liaison */}
          <a
            href="https://wa.me/919818856000?text=Hello%20RAMA%20INTERNATIONAL,%20we%2520are%20interested%20in%20recruiting%20manpower%20from%20India."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase px-4 py-2.5 rounded-lg text-[10px] tracking-wider shadow-lg transition-colors cursor-pointer"
          >
            <MessageCircle className="h-4.5 w-4.5 fill-white" />
            <span>Chat via WhatsApp</span>
          </a>

          {/* Mini Newsletter Subscribe */}
          <div className="space-y-2 pt-2">
            <h5 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Newsletter Alerts</h5>
            {newsSuccess ? (
              <p className="text-[10px] text-green-450 font-semibold">Subscribed successfully!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border border-gold-500/20 rounded-lg overflow-hidden text-xs">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-navy-900 text-white px-3.5 py-2.5 outline-none text-[11px]"
                />
                <button type="submit" className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-3.5 flex items-center justify-center cursor-pointer">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* 3. Bottom Legal Footer */}
      <div className="bg-[#020C1B] border-t border-gold-500/10 py-6 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} RAMA INTERNATIONAL-INDIA. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:text-gold-500 transition-colors">Privacy Dossier</Link>
            <Link href="/terms" className="hover:text-gold-500 transition-colors">Client Agreements</Link>
            <Link href="/sitemap" className="hover:text-gold-500 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
