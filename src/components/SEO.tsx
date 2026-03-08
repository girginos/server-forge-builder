import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

export default function SEO({ title, description, keywords, canonical, ogImage, jsonLd, noIndex }: SEOProps) {
  const siteName = "ServerMarket";
  const fullTitle = `${title} | ${siteName}`;
  const baseUrl = "https://servermarket.com.tr";
  const defaultOgImage = `${baseUrl}/og-image.jpg`;

  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-212-555-0000",
      contactType: "sales",
      areaServed: "TR",
      availableLanguage: "Turkish",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Maslak, Büyükdere Cad. No:123 Kat:5",
      addressLocality: "Sarıyer",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {canonical && <link rel="canonical" href={`${baseUrl}${canonical}`} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="tr_TR" />
      {canonical && <meta property="og:url" content={`${baseUrl}${canonical}`} />}
      <meta property="og:image" content={ogImage || defaultOgImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
}
