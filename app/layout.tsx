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
  // Primary metadata
  title: {
    default: "Ahid - Discover Verified Local Brands | Authentic Business Directory",
    template: "%s | Ahid"
  },
  description: "Ahid connects you with 5,000+ verified local brands in your community. Discover authentic businesses, explore product galleries, and shop confidently with our blue-tick verification system. Join 10,000+ users finding trusted brands nearby.",

  // Keywords for SEO
  keywords: [
    "verified local brands",
    "authentic businesses",
    "local business directory",
    "verified brands near me",
    "trusted local businesses",
    "brand discovery platform",
    "local commerce",
    "verified business directory",
    "authentic brand marketplace",
    "community brands",
    "local brand verification",
    "nearby verified businesses",
    "trusted brand directory",
    "local business discovery",
    "brand verification platform"
  ],

  // Author and creator information
  authors: [{ name: "Ahid" }],
  creator: "Ahid",
  publisher: "Ahid",

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ahid.com',
    siteName: 'Ahid',
    title: 'Ahid - Discover Verified Local Brands Near You',
    description: 'Connect with 5,000+ verified local brands in your community. Ahid is the trusted platform for discovering authentic businesses with our blue-tick verification system. Join 10,000+ users today.',
    images: [
      {
        url: '/og-image.jpg', // Add your actual OG image path
        width: 1200,
        height: 630,
        alt: 'Ahid - Connecting You to Authentic Local Brands',
      }
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Ahid - Discover Verified Local Brands Near You',
    description: 'Connect with 5,000+ verified local brands. Discover authentic businesses in your community with Ahid\'s trusted verification system.',
    images: ['/twitter-image.jpg'], // Add your actual Twitter image path
    creator: '@ahid', // Add your actual Twitter handle
  },

  // Verification tags
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // App-specific metadata
  applicationName: 'Ahid',
  appleWebApp: {
    capable: true,
    title: 'Ahid',
    statusBarStyle: 'default',
  },

  // Alternate languages (if applicable)
  alternates: {
    canonical: 'https://ahid.com',
    // languages: {
    //   'en-US': 'https://ahid.com/en-US',
    //   'fr-FR': 'https://ahid.com/fr-FR',
    // },
  },

  // Category
  category: 'Business & Local Services',

  // Classification
  classification: 'Business Directory, Local Commerce, Brand Discovery',

  // Other metadata
  other: {
    'og:phone_number': '+234-xxx-xxx-xxxx', // Add your actual phone
    'og:email': 'hello@ahid.com', // Add your actual email
    'og:latitude': '6.5244', // Port Harcourt coordinates (update as needed)
    'og:longitude': '7.4895',
    'og:locality': 'Port Harcourt',
    'og:region': 'Rivers State',
    'og:country-name': 'Nigeria',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
