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
    default: "GhiLớp — Nghe thầy, thấy chữ (VALSEA)",
    template: "%s · GhiLớp",
  },
  description:
    "GhiLớp: ghi chép buổi học realtime bằng VALSEA ASR — demo EdTech hackathon.",
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
