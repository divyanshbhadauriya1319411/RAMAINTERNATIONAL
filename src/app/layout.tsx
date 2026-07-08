import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAMA INTERNATIONAL | Global Recruitment & Manpower Consultancy",
  description: "From Interview to Visa: Your Complete Global Recruitment Partner. Premium recruitment platform for healthcare, construction, engineering, oil & gas, hospitality, and logistics.",
  keywords: ["International Recruitment", "Manpower Consultancy", "Jobs in GCC", "Saudi Arabia Jobs", "Dubai Jobs", "Healthcare Jobs Abroad", "Deepak Chauhan"],
  metadataBase: new URL("https://ramainternational.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RAMA INTERNATIONAL | Global Recruitment & Manpower Consultancy",
    description: "From Interview to Visa: Your Complete Global Recruitment Partner. Leading MEA-certified consultancy in India.",
    url: "/",
    siteName: "RAMA INTERNATIONAL-INDIA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RAMA INTERNATIONAL GLOBAL PARTNER",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAMA INTERNATIONAL | Global Recruitment & Manpower Consultancy",
    description: "From Interview to Visa: Your Complete Global Recruitment Partner.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-white text-navy-900">{children}</body>
    </html>
  );
}
