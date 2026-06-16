import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeapMoney Admin",
  description: "Internal operations panel",
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
