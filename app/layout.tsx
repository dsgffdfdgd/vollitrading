import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VOLLIFX | Institutional Trading Platform",
  description: "Advanced managed trading pools and capital allocation system.",
  metadataBase: new URL('https://vollitrading.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/20`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
