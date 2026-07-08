"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, CheckCircle, RefreshCw, Send, HelpCircle } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-luxury-light">
      <Navbar />

      {/* Page Header */}
      <section className="bg-navy-900 text-white py-16 text-center border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-3xl font-extrabold text-gold-500 tracking-wider">Contact & Global Inquiries</h1>
          <p className="text-xs text-gray-300 mt-1.5 font-light">
            Empower your next hiring campaign. Get in touch with our agency specialists.
          </p>
        </div>
      </section>

      {/* Main Content split */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-md">
          <h2 className="font-serif text-xl font-bold text-navy-900 mb-2">Submit a Manpower Request</h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Fill out the form below. A RAMA relationship director will review your requirements and respond within 24 hours.
          </p>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-start space-x-2">
              <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Thank you for contacting us!</p>
                <p className="mt-1">Your inquiry has been successfully logged. Our global desks team will respond shortly.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-navy-900 font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-luxury-light border border-gray-200 rounded-lg p-3 outline-none focus:border-gold-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. j.doe@company.com"
                  className="w-full bg-luxury-light border border-gray-200 rounded-lg p-3 outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Company / Group Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Saudi Builders Ltd"
                  className="w-full bg-luxury-light border border-gray-200 rounded-lg p-3 outline-none focus:border-gold-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Telephone / Whatsapp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +971 50 1234567"
                  className="w-full bg-luxury-light border border-gray-200 rounded-lg p-3 outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Hiring Requirements / Details *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail your requirements (e.g. number of workers needed, trade testing criteria, salary levels, destination country)..."
                className="w-full bg-luxury-light border border-gray-200 rounded-lg p-3 outline-none focus:border-gold-500 transition-colors resize-none"
              />
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
                  <Send className="h-4 w-4" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Global HQ Info */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="bg-navy-900 text-white rounded-xl border border-gold-500/20 p-6 sm:p-8 shadow-md space-y-6">
            <h3 className="font-serif text-lg font-bold text-gold-500 tracking-wider">RAMA CORPORATE OFFICE</h3>
            
            <div className="space-y-4 text-xs font-light">
              <div className="flex items-start space-x-3.5">
                <MapPin className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-200">Main Headquarters</h4>
                  <p className="text-gray-400 mt-1 leading-relaxed">
                    Rama Tower, 4th Floor, Ring Road, Sector-10, Dwarka, New Delhi, 110075, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Phone className="h-4.5 w-4.5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-200">Direct Recruiter Hotline</h4>
                  <p className="text-gray-400 mt-1">+91 11 4758 9600</p>
                  <p className="text-gray-400">+91 98188 56000</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Mail className="h-4.5 w-4.5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-200">Official Correspondence</h4>
                  <p className="text-gray-400 mt-1">corporate@ramainternational.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Placeholder (Luxurious Design Mockup) */}
          <div className="bg-navy-950 border border-gold-500/10 rounded-xl p-4 flex flex-col justify-center items-center h-48 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent)]" />
            <MapPin className="h-8 w-8 text-gold-500 mb-2 animate-float" />
            <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider font-serif">Dwarka Sector-10 HQ</p>
            <p className="text-[10px] text-gray-500 mt-1 text-center font-light">Interactive Routing Map Engine Ready</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
