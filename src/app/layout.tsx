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
    default: "Live Note Taker — Ghi chép buổi học realtime",
    template: "%s · Live Note Taker",
  },
  description:
    "Live Note Taker: ghi chép buổi học bằng giọng nói, transcript realtime với VALSEA ASR — Next.js, Supabase, Vercel.",
  applicationName: "Live Note Taker",
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
