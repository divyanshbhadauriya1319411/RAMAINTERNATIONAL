import type { Metadata } from "next";
import { Inter, Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import Providers from "@/components/providers/Providers";
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
  title: "RAMA INTERNATIONAL-INDIA | Global Manpower Consultancy",
  description: "From Interview to Visa: Your Complete Global Recruitment Partner. Premium recruitment platform for healthcare, construction, engineering, oil & gas, hospitality, and logistics.",
  keywords: ["International Recruitment", "Manpower Consultancy", "Jobs in GCC", "Saudi Arabia Jobs", "Dubai Jobs", "Healthcare Jobs Abroad", "Deepak Chauhan"],
  metadataBase: new URL("https://ramainternational.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RAMA INTERNATIONAL-INDIA | Global Manpower Consultancy",
    description: "From Interview to Visa: Your Complete Global Recruitment Partner. Leading MEA-certified consultancy in India.",
    url: "/",
    siteName: "RAMA INTERNATIONAL-INDIA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RAMA INTERNATIONAL-INDIA GLOBAL PARTNER",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAMA INTERNATIONAL-INDIA | Global Manpower Consultancy",
    description: "From Interview to Visa: Your Complete Global Recruitment Partner.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cinzel.variable} ${plusJakartaSans.variable} h-full antialiased font-sans`}
    >
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-navy-950 text-navy-900 dark:text-white transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
