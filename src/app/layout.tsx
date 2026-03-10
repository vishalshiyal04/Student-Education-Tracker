import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { PointerFix } from "@/components/PointerFix";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Education Tracker",
  description: "Modern Next.js scaffold optimized for AI-powered development with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["EduTrack", "Student", "Education", "Course Management", "Assignment Tracker", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "Edu-Track Team" }],
  icons: {
    icon: "https://t4.ftcdn.net/jpg/04/11/39/67/360_F_411396712_5IXfo8fZhWRaFc6lVv6sJJMkEtV6eeua.jpg",
  },
  openGraph: {
    title: "Education-Tracker - Student Affairs Management",
    description: "Manage your academic life with ease",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PointerFix />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}