import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LeapMoney — Intelligent Loan Marketplace",
    template: "%s | LeapMoney",
  },
  description:
    "India's AI-powered loan marketplace. Get matched with the right lender in minutes.",
  keywords: ["home loan", "personal loan", "business loan", "loan marketplace", "India"],
  metadataBase: new URL("https://leapmoney.net"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "LeapMoney",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
