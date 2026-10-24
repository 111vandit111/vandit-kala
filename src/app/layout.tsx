import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SavedProjectProvider } from "../../hooks/useSavedProjectContext";
import IntroLoader from "../../lib/IntroLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vandit Kala | Software Engineer & Problem Solver",
  description:
    "Vandit Kala is a software engineer and problem solver with deep expertise in React.js, Next.js, TypeScript, Node.js, and MongoDB. Building scalable web apps and AI integrations for platforms like Hoonr.ai and UXMagic.ai. Let's build something extraordinary.",
  keywords: [
    "Vandit Kala",
    "Software Engineer",
    "Problem Solver",
    "Next.js Developer",
    "React.js Developer",
    "TypeScript Developer",
    "MongoDB",
    "AI Developer",
    "Hoonr.ai",
    "UXMagic.ai",
    "Full-Stack Developer",
    "Backend Developer",
    "Web Development",
    "Generative AI",
    "Custom Hooks",
    "Bundle Optimization",
  ],
  authors: [{ name: "Vandit Kala", url: "https://vandit-kala.vercel.app" }],
  creator: "Vandit Kala",
  openGraph: {
    title: "Vandit Kala | Software Engineer & Problem Solver",
    description:
      "Explore the portfolio of Vandit Kala, a software engineer building high-performance React/Next.js apps and integrating AI to solve complex problems.",
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
    title: "Vandit Kala | Software Engineer & Problem Solver",
    description:
      "Software engineer and problem solver with a passion for crafting fast, scalable web apps and leveraging AI for efficiency and automation.",
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
        <IntroLoader />
        <SavedProjectProvider>
        {children}
        </SavedProjectProvider>
      </body>
    </html>
  );
}
