// SEO optimization utilities for Phase 7

import Head from 'next/head'

export const SEOConfig = {
  title: 'Multi-Subdomain Management',
  description: 'Enterprise-grade multi-subdomain management interface with SSL certificates, backups, and advanced features',
  image: '/og-image.jpg',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://multi-subdomain.app',
  twitterHandle: '@yourbrand',
  keywords: ['subdomain', 'management', 'SSL', 'certificates', 'hosting', 'enterprise'],
}

export const generateSEOMeta = (pageData = {}) => {
  const {
    title = SEOConfig.title,
    description = SEOConfig.description,
    image = SEOConfig.image,
    url = SEOConfig.url,
    type = 'website',
    noindex = false,
  } = pageData

  return {
    title,
    description,
    image,
    url,
    type,
    noindex,
  }
}

export const SeoHead = ({ meta }) => {
  const {
    title = SEOConfig.title,
    description = SEOConfig.description,
    image = SEOConfig.image,
    url = SEOConfig.url,
    type = 'website',
    noindex = false,
  } = meta || {}

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={SEOConfig.keywords.join(', ')} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#070d1a" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content={SEOConfig.twitterHandle} />

      {/* SEO */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Links */}
      <link rel="canonical" href={url} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: title,
            description,
            url,
            applicationCategory: 'WebApplication',
            offers: {
              '@type': 'Offer',
              availability: 'http://schema.org/InStock',
            },
          }),
        }}
      />
    </Head>
  )
}

// Sitemap generation
export const generateSitemap = (pages = []) => {
  const domain = SEOConfig.url
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/features', priority: 0.8, changefreq: 'monthly' },
    { path: '/pricing', priority: 0.8, changefreq: 'monthly' },
    { path: '/docs', priority: 0.7, changefreq: 'weekly' },
  ]

  const allPages = [...staticPages, ...pages]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      page => `
  <url>
    <loc>${domain}${page.path}</loc>
    <changefreq>${page.changefreq || 'monthly'}</changefreq>
    <priority>${page.priority || 0.5}</priority>
  </url>
  `
    )
    .join('')}
</urlset>`
}

// Robots.txt generation
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /.next
Sitemap: ${SEOConfig.url}/sitemap.xml`
}
