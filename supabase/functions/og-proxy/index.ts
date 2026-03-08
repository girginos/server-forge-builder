const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = 'https://server.girginos.net';
const SITE_NAME = 'ServerMarket';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Googlebot',
  'bingbot',
  'Applebot',
  'Pinterest',
  'vkShare',
  'Viber',
  'Skype',
  'redditbot',
];

interface RouteMeta {
  title: string;
  description: string;
  keywords?: string;
}

const routesMeta: Record<string, RouteMeta> = {
  '/': {
    title: 'Kurumsal Sunucu Donanım Çözümleri | ServerMarket',
    description: "Türkiye'nin güvenilir sunucu donanım tedarikçisi. Dell, HP, Supermicro sunucu satışı, yapılandırma, colocation ve cloud hizmetleri.",
    keywords: 'sunucu satış, server donanım, dell poweredge, hp proliant, supermicro, sunucu yapılandırma, colocation',
  },
  '/hardware': {
    title: 'Sunucu Donanımları | ServerMarket',
    description: 'Dell, HP, Supermicro sunucu donanımları. Marka, fiyat ve form faktörüne göre filtreleyin, ihtiyacınıza uygun sunucuyu bulun.',
    keywords: 'sunucu donanım, dell poweredge, hp proliant, supermicro, rack sunucu, 1u sunucu, 2u sunucu',
  },
  '/hazir-paketler': {
    title: 'Hazır Sunucu Paketleri | ServerMarket',
    description: 'İş yükünüze göre optimize edilmiş hazır sunucu paketleri. Web, veritabanı, sanallaştırma, AI ve depolama sunucuları.',
    keywords: 'hazır sunucu, sunucu paketi, web sunucu, veritabanı sunucu, sanallaştırma sunucu, AI sunucu',
  },
  '/yapilandirici': {
    title: 'Sunucu Yapılandırıcı | ServerMarket',
    description: 'Sunucunuzu özelleştirin. CPU, RAM, depolama, RAID, ağ kartı ve güç kaynağı seçenekleriyle ihtiyacınıza özel sunucu yapılandırın.',
    keywords: 'sunucu yapılandırma, server configurator, özel sunucu, sunucu özelleştirme',
  },
  '/colocation': {
    title: 'Colocation Hizmetleri | ServerMarket',
    description: "Tier III+ veri merkezlerinde sunucu barındırma. Yedekli güç, 7/24 güvenlik, yüksek bant genişliği ile kesintisiz colocation hizmetleri.",
    keywords: 'colocation, sunucu barındırma, veri merkezi, datacenter, server hosting, rack kirala',
  },
  '/cloud': {
    title: 'Cloud Çözümleri | ServerMarket',
    description: 'Ölçeklenebilir cloud sunucu, depolama ve CDN hizmetleri. Esnek, güvenli ve yüksek performanslı bulut altyapısı.',
    keywords: 'cloud sunucu, bulut hizmetleri, vps, sanal sunucu, cloud depolama, CDN, kubernetes',
  },
  '/leasing': {
    title: 'Kirala Senin Olsun - Sunucu Kiralama | ServerMarket',
    description: 'Peşinatsız, sabit taksitlerle sunucu sahibi olun. 12-48 ay vade, garanti dahil. Kurumsal sunucu kiralama çözümleri.',
    keywords: 'sunucu kiralama, kirala senin olsun, sunucu leasing, sunucu taksit, kurumsal kiralama',
  },
  '/hakkimizda': {
    title: 'Hakkımızda | ServerMarket',
    description: "ServerMarket olarak 15 yılı aşkın süredir Türkiye'nin önde gelen kurumsal sunucu çözümleri sağlayıcısıyız.",
    keywords: 'servermarket hakkında, sunucu firması, kurumsal çözümler, sunucu tedarikçi',
  },
  '/iletisim': {
    title: 'İletişim | ServerMarket',
    description: 'ServerMarket ile iletişime geçin. Sunucu donanımı, colocation ve cloud hizmetleri için teklif alın. 7/24 teknik destek.',
    keywords: 'iletişim, teklif al, sunucu satış, teknik destek, servermarket iletişim',
  },
};

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function buildHtml(meta: RouteMeta, path: string): string {
  const fullUrl = `${SITE_URL}${path}`;
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  ${meta.keywords ? `<meta name="keywords" content="${meta.keywords}" />` : ''}
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${fullUrl}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="tr_TR" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:image" content="${OG_IMAGE}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />

  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
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
  })}
  </script>
</head>
<body>
  <h1>${meta.title}</h1>
  <p>${meta.description}</p>
  <a href="${fullUrl}">Siteye git</a>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    const userAgent = url.searchParams.get('ua') || req.headers.get('user-agent') || '';

    // Check if request is from a bot
    if (!isBot(userAgent)) {
      return new Response(
        JSON.stringify({ bot: false, message: 'Not a bot, serve React app normally' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize path
    const normalizedPath = path.replace(/\/+$/, '') || '/';
    const meta = routesMeta[normalizedPath];

    if (!meta) {
      // Fallback to homepage meta
      const fallback = routesMeta['/']!;
      return new Response(buildHtml(fallback, normalizedPath), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response(buildHtml(meta, normalizedPath), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
