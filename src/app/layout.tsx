import { JetBrains_Mono, Noto_Sans_Thai, Nunito } from "next/font/google";
import type { Viewport } from "next";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const fontSans = Nunito({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

/** Nunito has no Thai glyphs in next/font; load only for `lang="th"`. */
const fontThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["latin", "thai"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${locale === "th" ? fontThai.variable : ""} ${fontMono.variable} min-h-dvh antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
