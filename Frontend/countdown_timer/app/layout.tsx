import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modern Countdown Timer",
  description: "A beautiful and responsive countdown timer for events, launches, and deadlines",
  icons: {
    icon: "/hourglass.png",
  },
  openGraph: {
    title: "Modern Countdown Timer",
    description: "A beautiful and responsive countdown timer for events, launches, and deadlines",
    type: "website",
    locale: "en_US",
    siteName: "Countdown Timer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Countdown Timer",
    description: "A beautiful and responsive countdown timer for events, launches, and deadlines",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
