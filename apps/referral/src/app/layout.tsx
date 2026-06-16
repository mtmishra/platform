import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeapMoney Referral",
  description: "Refer and earn rewards",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
