import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/context/cart-context"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://glamourcosmetics.com"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Glamour Cosmetics | Premium Makeup, Skincare & Fragrances in Pakistan",
    template: "%s | Glamour Cosmetics",
  },
  description:
    "Discover premium beauty products at Glamour Cosmetics. Shop the finest makeup, skincare, and fragrances for women, men, and kids. Free shipping on orders over Rs. 5,000. 100% authentic products.",
  keywords: [
    "Glamour Cosmetics",
    "makeup Pakistan",
    "skincare Pakistan",
    "fragrances Pakistan",
    "cosmetics online",
    "beauty products",
    "lipstick",
    "foundation",
    "moisturizer",
    "perfume",
    "cologne",
    "women cosmetics",
    "men grooming",
    "kids skincare",
    "premium beauty",
    "online beauty store Pakistan",
  ],
  authors: [{ name: "Glamour Cosmetics", url: siteUrl }],
  creator: "Glamour Cosmetics",
  publisher: "Glamour Cosmetics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Glamour Cosmetics",
    title: "Glamour Cosmetics | Premium Makeup, Skincare & Fragrances",
    description:
      "Discover premium beauty products at Glamour Cosmetics. Shop the finest makeup, skincare, and fragrances.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Glamour Cosmetics - Premium Beauty Products",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glamour Cosmetics | Premium Makeup, Skincare & Fragrances",
    description:
      "Discover premium beauty products at Glamour Cosmetics. Shop the finest makeup, skincare, and fragrances.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@glamourcosmetics",
    site: "@glamourcosmetics",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Beauty & Cosmetics",
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  other: {
    "msapplication-TileColor": "#da532c",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Glamour Cosmetics",
  },
}

// JSON-LD Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Glamour Cosmetics",
  url: siteUrl,
  logo: `${siteUrl}/placeholder-logo.png`,
  sameAs: [
    "https://facebook.com/glamourcosmetics",
    "https://instagram.com/glamourcosmetics",
    "https://twitter.com/glamourcosmetics",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-XXX-XXXXXXX",
    contactType: "customer service",
    availableLanguage: ["English", "Urdu"],
  },
}

// JSON-LD WebSite Schema for Sitelinks Search Box
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Glamour Cosmetics",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/collection?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased">
        <CartProvider>{children}</CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
