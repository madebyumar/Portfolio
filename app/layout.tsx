import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Archivo, IBM_Plex_Mono, Syne } from 'next/font/google'
import './globals.css'
import { PortfolioScripts } from '@/components/portfolio/effects/PortfolioScripts'
import { AnimationProvider } from '@/components/portfolio/effects/AnimationProvider'
import { VisitTracker } from '@/components/portfolio/effects/VisitTracker'
import { ChatWidget } from '@/components/portfolio/chat/ChatWidget'
import { getSiteUrl } from '@/lib/env'
import { SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE } from '@/lib/seo/keywords'
import { getLiveThemePaletteId } from '@/lib/data/portfolio'
import { buildPaletteCSS, getPalette } from '@/lib/theme/palettes'

export const revalidate = 60

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SEO_TITLE,
    template: '%s — Umar Shoaib',
  },
  description: SEO_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: 'Umar Shoaib', url: siteUrl }],
  creator: 'Umar Shoaib',
  publisher: 'Umar Shoaib',
  category: 'technology',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    type: 'website',
    url: siteUrl,
    siteName: 'Umar Shoaib',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e0e0c',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Umar Shoaib',
      description: SEO_DESCRIPTION,
      publisher: { '@id': `${siteUrl}/#person` },
      inLanguage: 'en',
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Umar Shoaib',
      url: siteUrl,
      image: `${siteUrl}/uploads/portrait.jpeg`,
      jobTitle: 'Software Engineer · Full-Stack & AI',
      description: SEO_DESCRIPTION,
      email: 'mailto:contact@umarshoaib.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gujranwala',
        addressCountry: 'PK',
      },
      sameAs: [
        'https://github.com/madebyumar',
        'https://www.linkedin.com/in/umar-shoaib20',
      ],
      knowsAbout: [
        'Full-stack development',
        'Web development',
        'App development',
        'Laravel',
        'MERN stack',
        'Python',
        'OpenAI',
        'Computer vision',
        'API development',
        'AI engineering',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#service`,
      name: 'Umar Shoaib — Freelance Software Engineering',
      url: `${siteUrl}/hire`,
      image: `${siteUrl}/uploads/portrait.jpeg`,
      description:
        'Hire a full-stack and AI software engineer for web apps, APIs, Laravel/MERN projects, and OpenAI integrations.',
      provider: { '@id': `${siteUrl}/#person` },
      areaServed: ['Worldwide', 'Pakistan', 'United Kingdom', 'United States', 'UAE'],
      serviceType: [
        'Hire full stack developer',
        'Hire AI engineer',
        'Hire Laravel developer',
        'Hire web developer',
        'Hire app developer',
        'Freelance software engineer',
      ],
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${siteUrl}/hire`,
        availableLanguage: ['English'],
      },
    },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const paletteId = await getLiveThemePaletteId()
  const palette = getPalette(paletteId)
  const paletteCss = buildPaletteCSS(palette)

  return (
    <html
      lang="en"
      data-palette={palette.id}
      suppressHydrationWarning
      className={`${syne.variable} ${archivo.variable} ${plexMono.variable}`}
    >
      <body suppressHydrationWarning>
        <style
          id="umar-theme-engine-styles"
          dangerouslySetInnerHTML={{ __html: paletteCss }}
        />
        <Script
          id="clean-extensions"
          src="/scripts/clean-extensions.js"
          strategy="beforeInteractive"
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PortfolioScripts />
        <VisitTracker />
        <AnimationProvider>{children}</AnimationProvider>
        <ChatWidget />
      </body>
    </html>
  )
}
