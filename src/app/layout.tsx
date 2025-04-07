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
  title: "Vandit Kala | Frontend Developer & AI Enthusiast",
  description:
    "Vandit Kala is a skilled Frontend Developer with deep expertise in React.js, Next.js, TypeScript, and MongoDB. Specializing in scalable web apps and AI integrations for platforms like Hoonr.ai and UXMagic.ai. Let's build something extraordinary.",
  keywords: [
    "Vandit Kala",
    "Frontend Developer",
    "Next.js Developer",
    "React.js Developer",
    "TypeScript Developer",
    "MongoDB",
    "AI Developer",
    "Hoonr.ai",
    "UXMagic.ai",
    "Full-Stack Developer",
    "Software Engineer",
    "Web Development",
    "Generative AI",
    "Custom Hooks",
    "Bundle Optimization",
  ],
  authors: [{ name: "Vandit Kala", url: "https://vandit-kala.vercel.app" }],
  creator: "Vandit Kala",
  openGraph: {
    title: "Vandit Kala | Frontend Developer & AI Enthusiast",
    description:
      "Explore the portfolio of Vandit Kala, a developer building high-performance React/Next.js apps and integrating AI to solve complex problems.",
    url: "https://vandit-kala.vercel.app",
    siteName: "Vandit Kala",
    images: [
      {
        url: "/log-w.png",
        width: 1200,
        height: 630,
        alt: "Vandit Kala Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vandit Kala | Frontend Developer & AI Enthusiast",
    description:
      "Developer with a passion for crafting fast, scalable web apps and leveraging AI for efficiency and automation.",
    images: ["/log-w.png"],
    creator: "@111vandit111 Github", 
  },
  icons: {
    icon: "/log-w.png",
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
        className={`${geistSans.variable} ${geistMono.variable} bg-secondary-900 antialiased text-white`}
      >
        {children}
      </body>
    </html>
  );
}
