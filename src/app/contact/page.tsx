"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, CheckCircle, RefreshCw, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, companyName, phone, message }),
      });

      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setCompanyName("");
        setPhone("");
        setMessage("");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit inquiry.");
      }
    } catch (e) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-navy-900 font-sans">
      <Navbar />

      {/* Page Header */}
      <section className="bg-[#051B3D] text-white pt-32 pb-20 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 space-y-4">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Contact &amp; Global Offices</h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
            Empower your next hiring campaign. Get in touch with our agency specialists.
          </p>
        </div>
      </section>

      {/* Main Content split */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 w-full">
        
        {/* Contact Form card */}
        <div className="bg-white border border-gray-150 rounded-[32px] p-6 sm:p-8 shadow-enterprise">
          <h2 className="font-headline text-xl font-bold text-navy-900 mb-2">Submit a Manpower Request</h2>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed font-light">
            Fill out the form below. A RAMA relationship director will review your requirements and respond within 24 hours.
          </p>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs flex items-start space-x-2">
              <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold font-headline">Thank you for contacting us!</p>
                <p className="mt-1">Your inquiry has been successfully logged. Our global desks team will respond shortly.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs text-navy-900 font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-navy-900 mb-1.5 font-headline">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white transition-all text-navy-900 font-medium font-sans"
                />
              </div>
              <div>
                <label className="block text-navy-900 mb-1.5 font-headline">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. j.doe@company.com"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white transition-all text-navy-900 font-medium font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-navy-900 mb-1.5 font-headline">Company / Group Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Saudi Builders Ltd"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white transition-all text-navy-900 font-medium font-sans"
                />
              </div>
              <div>
                <label className="block text-navy-900 mb-1.5 font-headline">Telephone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +971 50 1234567"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white transition-all text-navy-900 font-medium font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-navy-900 mb-1.5 font-headline">Hiring Requirements / Details *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail your requirements (e.g. number of workers needed, trade testing criteria, salary levels, destination country)..."
                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600 focus:bg-white transition-all text-navy-900 font-medium resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-4 rounded-full flex items-center justify-center space-x-2 text-xs shadow-lg hover:shadow-blue-500/10 cursor-pointer disabled:opacity-50 transition-all font-headline border border-blue-500/20 hover:-translate-y-0.5"
            >
              {loading ? (
                <RefreshCw className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Global HQ Info */}
        <div className="space-y-8 flex flex-col justify-between h-full">
          <div className="bg-[#051B3D] text-white rounded-[24px] border border-white/5 p-8 shadow-2xl space-y-6">
            <h3 className="font-headline text-lg font-bold text-gold-500 tracking-wider uppercase">RAMA CORPORATE OFFICE</h3>
            
            <div className="space-y-6 text-xs font-light">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white font-headline text-sm">Main Headquarters</h4>
                  <p className="text-gray-300 mt-1 leading-relaxed">
                    Rama Tower, 4th Floor, Ring Road, Sector-10, Dwarka, New Delhi, 110075, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white font-headline text-sm">Direct Recruiter Hotline</h4>
                  <p className="text-gray-350 mt-1 font-semibold">+91 93105 89800</p>
                  <p className="text-gray-350">+91 82879 85415 / +91 78397 07378</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white font-headline text-sm">Official Correspondence</h4>
                  <p className="text-gray-355 mt-1">ramainternationalindia2@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Placeholder (Luxurious Design Mockup) */}
          <div className="bg-navy-950 border border-white/5 rounded-[24px] p-6 flex flex-col justify-center items-center h-52 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent)]" />
            <MapPin className="h-8 w-8 text-gold-500 mb-2 animate-float" />
            <p className="text-gold-500 text-xs font-bold uppercase tracking-wider font-headline">Dwarka Sector-10 HQ</p>
            <p className="text-[10px] text-gray-400 mt-1 text-center font-light leading-normal">
              Rama Tower, 4th Floor, Ring Road, Sector-10, Dwarka, New Delhi, India
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText("28.5831, 77.0673");
                alert("HQ Coordinates copied to clipboard!");
              }}
              className="mt-4 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-450 hover:bg-blue-600 hover:text-white rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-200"
            >
              Copy GPS Coordinates
            </button>
          </div>

          {/* WhatsApp Support CTA Card */}
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[24px] flex items-center justify-between shadow-enterprise">
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-900 font-headline text-sm flex items-center space-x-1.5">
                <MessageCircle className="h-5 w-5 fill-emerald-600 text-emerald-600 shrink-0" />
                <span>Instant Support?</span>
              </h4>
              <p className="text-xs text-emerald-850 font-light">Connect with our support team on WhatsApp for quick inquiries.</p>
            </div>
            <a
              href="https://wa.me/919818856000?text=Hello%20RAMA%20INTERNATIONAL,%20we%2520are%2520interested%20in%20recruiting%20manpower%20from%20India."
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 font-headline text-[10px] uppercase font-bold tracking-wider"
            >
              Chat Now
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
