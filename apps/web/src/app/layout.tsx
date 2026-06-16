import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeapMoney",
  description: "India's trusted loan marketplace",
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
