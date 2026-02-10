import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Alert System - Never Miss Your Dream Job",
  description: "Subscribe to job alerts and get notified about the latest opportunities matching your preferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
