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
  title: "Vandit Kala | Developer & AI Enthusiast",
  description:
    "I’m Vandit Kala, a passionate Frontend & Developer with expertise in React.js, Next.js, TypeScript, and MongoDB. I build scalable, high-performance web applications and have experience optimizing React apps, creating custom hooks, and reducing bundle sizes. I’ve worked on AI-driven platforms like Hoonr.ai and UXMagic.ai, integrating AI for automation and efficiency. Let’s connect and build something amazing!",
  icons:{
    icon:"/log-w.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-secondary-900  antialiased text-white`}
      >
        {children}
      </body>
    </html>
  );
}
