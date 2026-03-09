import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = 'https://server.girginos.net';
const SITE_NAME = 'ServerMarket';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const BOT_USER_AGENTS = [
  'facebookexternalhit', 'Facebot', 'Twitterbot', 'LinkedInBot',
  'WhatsApp', 'Slackbot', 'TelegramBot', 'Discordbot',
  'Googlebot', 'bingbot', 'Applebot', 'Pinterest',
  'vkShare', 'Viber', 'Skype', 'redditbot',
];

const CATEGORY_LABELS: Record<string, string> = {
  server: "Sunucu (Komple)",
  "cto-sunucular": "CTO Sunucular",
  disk: "Disk & Depolama",
  cpu: "CPU - İşlemci",
  ram: "RAM - Bellek",
  "ethernet-kartlari": "Ethernet Kartları",
  "switch-router": "Switch & Router",
  kablo: "Kablo & Bağlantı",
  anakart: "Anakart",
};

// Maps DB category value -> URL slug
const CATEGORY_SLUG_MAP: Record<string, string> = {
  server: "server",
  "cto-sunucular": "cto-sunucular",
  disk: "disk",
  cpu: "cpu",
  ram: "ram",
  ethernet: "ethernet-kartlari",
  "switch-router": "switch-router",
  kablo: "kablo",
  anakart: "anakart",
};

interface RouteMeta {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

const routesMeta: Record<string, RouteMeta> = {
  '/': {
    title: 'Kurumsal Sunucu Donanım Çözümleri',
    description: "Türkiye'nin güvenilir sunucu donanım tedarikçisi. Dell, HP, Supermicro sunucu satışı, yapılandırma, colocation ve cloud hizmetleri.",
    keywords: 'sunucu satış, server donanım, dell poweredge, hp proliant, supermicro',
  },
  '/hardware': {
    title: 'Sunucu Donanımları',
    description: 'Dell, HP, Supermicro sunucu donanımları. Marka, fiyat ve form faktörüne göre filtreleyin.',
    keywords: 'sunucu donanım, dell poweredge, hp proliant, supermicro, rack sunucu',
  },
  '/hazir-paketler': {
    title: 'Hazır Sunucu Paketleri',
    description: 'İş yükünüze göre optimize edilmiş hazır sunucu paketleri.',
    keywords: 'hazır sunucu, sunucu paketi, web sunucu, veritabanı sunucu',
  },
  '/yapilandirici': {
    title: 'Sunucu Yapılandırıcı',
    description: 'Sunucunuzu özelleştirin. CPU, RAM, depolama seçenekleriyle ihtiyacınıza özel sunucu yapılandırın.',
    keywords: 'sunucu yapılandırma, server configurator, özel sunucu',
  },
  '/colocation': {
    title: 'Colocation Hizmetleri',
    description: 'Tier III+ veri merkezlerinde sunucu barındırma. Yedekli güç, 7/24 güvenlik.',
    keywords: 'colocation, sunucu barındırma, veri merkezi, datacenter',
  },
  '/cloud': {
    title: 'Cloud Çözümleri',
    description: 'Ölçeklenebilir cloud sunucu, depolama ve CDN hizmetleri.',
    keywords: 'cloud sunucu, bulut hizmetleri, vps, sanal sunucu',
  },
  '/leasing': {
    title: 'Kirala Senin Olsun - Sunucu Kiralama',
    description: 'Peşinatsız, sabit taksitlerle sunucu sahibi olun. 12-48 ay vade.',
    keywords: 'sunucu kiralama, kirala senin olsun, sunucu leasing',
  },
  '/hakkimizda': {
    title: 'Hakkımızda',
    description: "ServerMarket olarak 15 yılı aşkın süredir Türkiye'nin önde gelen kurumsal sunucu çözümleri sağlayıcısıyız.",
  },
  '/iletisim': {
    title: 'İletişim',
    description: 'ServerMarket ile iletişime geçin. Sunucu donanımı, colocation ve cloud hizmetleri için teklif alın.',
  },
};

// Add hardware subcategory routes
for (const [slug, label] of Object.entries(CATEGORY_LABELS)) {
  routesMeta[`/hardware/${slug}`] = {
    title: `${label} | Sunucu Donanımları`,
    description: `${label} ürünleri. En uygun fiyatlarla sunucu ${label.toLowerCase()} çözümleri.`,
    keywords: `${label.toLowerCase()}, sunucu donanım, servermarket`,
  };
}

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildHtml(meta: RouteMeta, path: string): string {
  const fullUrl = `${SITE_URL}${path}`;
  const title = `${meta.title} | ${SITE_NAME}`;
  const ogImg = meta.ogImage || OG_IMAGE;
  const jsonLd = meta.jsonLd || {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
  };

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  ${meta.keywords ? `<meta name="keywords" content="${escapeHtml(meta.keywords)}" />` : ''}
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${fullUrl}" />
  <meta property="og:type" content="${meta.jsonLd ? 'product' : 'website'}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="tr_TR" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:image" content="${ogImg}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
  <meta name="twitter:image" content="${ogImg}" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <h1>${escapeHtml(meta.title)}</h1>
  <p>${escapeHtml(meta.description)}</p>
  <a href="${fullUrl}">Siteye git</a>
</body>
</html>`;
}

async function getProductMeta(productSlug: string, categorySlug: string): Promise<RouteMeta | null> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("admin_products")
      .select("name, short_description, description, category, price, image_url, images, in_stock, specs")
      .eq("slug", productSlug)
      .single();

    if (error || !data) return null;

    const catLabel = CATEGORY_LABELS[categorySlug] || categorySlug;
    const description = data.short_description || data.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `${data.name} - ${catLabel} kategorisinde. ServerMarket'te en uygun fiyatlarla.`;
    const firstImage = data.images?.[0] || data.image_url || OG_IMAGE;

    return {
      title: data.name,
      description,
      keywords: `${data.name}, ${catLabel}, sunucu donanım, servermarket`,
      ogImage: firstImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: data.name,
        description,
        image: firstImage,
        brand: typeof data.specs === "object" && data.specs !== null ? (data.specs as Record<string, string>).brand || "" : "",
        offers: {
          "@type": "Offer",
          price: data.price.toString(),
          priceCurrency: "TRY",
          availability: data.in_stock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${SITE_URL}/urun/${categorySlug}/${productSlug}`,
        },
      },
    };
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    const userAgent = url.searchParams.get('ua') || req.headers.get('user-agent') || '';

    if (!isBot(userAgent)) {
      return new Response(
        JSON.stringify({ bot: false, message: 'Not a bot, serve React app normally' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedPath = path.replace(/\/+$/, '') || '/';

    // Check if it's a product detail page: /urun/:categorySlug/:productSlug
    const productMatch = normalizedPath.match(/^\/urun\/([^/]+)\/([^/]+)$/);
    if (productMatch) {
      const [, categorySlug, productSlug] = productMatch;
      const productMeta = await getProductMeta(productSlug, categorySlug);
      if (productMeta) {
        return new Response(buildHtml(productMeta, normalizedPath), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    }

    // Static routes
    const meta = routesMeta[normalizedPath] || routesMeta['/']!;
    return new Response(buildHtml(meta, normalizedPath), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
