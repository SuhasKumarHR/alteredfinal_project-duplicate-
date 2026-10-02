import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACR_AGENT | Autonomous CI/CD Healing",
  description:
    "AI-powered autonomous CI/CD failure detection, analysis, healing, and validation.",
  keywords: [
    "ACR_AGENT",
    "CI/CD",
    "AI",
    "DevOps",
    "Autonomous Healing",
    "GitHub",
    "Docker",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}