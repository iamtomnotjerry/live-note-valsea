import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Live Note — Ghi chép buổi học",
    template: "%s · Live Note",
  },
  description:
    "Ứng dụng web Next.js + Supabase: nền tảng ghi chép và tóm tắt buổi học (VALSEA hackathon).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${fontSans.variable} ${fontMono.variable} min-h-dvh antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
