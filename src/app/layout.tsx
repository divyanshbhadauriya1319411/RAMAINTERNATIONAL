import type { Metadata } from "next";
import { Inter, Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-headline",
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
      className={`${inter.variable} ${cinzel.variable} ${plusJakartaSans.variable} h-full antialiased font-sans`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const supportDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (supportDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-navy-950 text-navy-900 dark:text-white transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
