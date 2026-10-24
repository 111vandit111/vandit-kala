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

const SITE_URL = "https://vandit-kala.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  applicationName: "Vandit Kala",
  verification: { google: "fO7_oFN5msJi_hdrMoe84T9hLnUq09ozGd3wLAdHvzg" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  title: {
    default: "Vandit Kala | Software Engineer & Problem Solver",
    template: "%s | Vandit Kala",
  },
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
  },
  icons: {
    icon: "/log-w.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Vandit Kala",
      url: SITE_URL,
      image: `${SITE_URL}/vanditkalahero.png`,
      jobTitle: "Software Engineer",
      description:
        "Software engineer and problem solver specialising in React.js, Next.js, TypeScript, Node.js and MongoDB.",
      knowsAbout: ["React.js", "Next.js", "TypeScript", "Node.js", "MongoDB", "Generative AI"],
      sameAs: [
        "https://github.com/111vandit111",
        "https://linkedin.com/in/vandit-kala-8293b4200",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Vandit Kala",
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
