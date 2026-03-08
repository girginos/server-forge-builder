import { Plugin, loadEnv } from "vite";

interface RouteMeta {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogImage?: string;
}

const getBaseUrl = () =>
  process.env.VITE_SITE_URL || "https://server-forge-builder.lovable.app";

const staticRoutesMeta: Record<string, RouteMeta> = {
  "/": {
    title: "Kurumsal Sunucu Donanım Çözümleri | ServerMarket",
    description:
      "Türkiye'nin güvenilir sunucu donanım tedarikçisi. Dell, HP, Supermicro sunucu satışı, yapılandırma, colocation ve cloud hizmetleri.",
    keywords:
      "sunucu satış, server donanım, dell poweredge, hp proliant, supermicro, sunucu yapılandırma, colocation",
    canonical: "/",
  },
  "/hardware": {
    title: "Sunucu Donanımları | ServerMarket",
    description:
      "Dell, HP, Supermicro sunucu donanımları. Marka, fiyat ve form faktörüne göre filtreleyin, ihtiyacınıza uygun sunucuyu bulun.",
    keywords:
      "sunucu donanım, dell poweredge, hp proliant, supermicro, rack sunucu, 1u sunucu, 2u sunucu",
    canonical: "/hardware",
  },
  "/hazir-paketler": {
    title: "Hazır Sunucu Paketleri | ServerMarket",
    description:
      "İş yükünüze göre optimize edilmiş hazır sunucu paketleri. Web, veritabanı, sanallaştırma, AI ve depolama sunucuları.",
    keywords:
      "hazır sunucu, sunucu paketi, web sunucu, veritabanı sunucu, sanallaştırma sunucu, AI sunucu",
    canonical: "/hazir-paketler",
  },
  "/yapilandirici": {
    title: "Sunucu Yapılandırıcı | ServerMarket",
    description:
      "Sunucunuzu özelleştirin. CPU, RAM, depolama, RAID, ağ kartı ve güç kaynağı seçenekleriyle ihtiyacınıza özel sunucu yapılandırın.",
    keywords:
      "sunucu yapılandırma, server configurator, özel sunucu, sunucu özelleştirme",
    canonical: "/yapilandirici",
  },
  "/colocation": {
    title: "Colocation Hizmetleri | ServerMarket",
    description:
      "Tier III+ veri merkezlerinde sunucu barındırma. Yedekli güç, 7/24 güvenlik, yüksek bant genişliği ile kesintisiz colocation hizmetleri.",
    keywords:
      "colocation, sunucu barındırma, veri merkezi, datacenter, server hosting, rack kirala",
    canonical: "/colocation",
  },
  "/cloud": {
    title: "Cloud Çözümleri | ServerMarket",
    description:
      "Ölçeklenebilir cloud sunucu, depolama ve CDN hizmetleri. Esnek, güvenli ve yüksek performanslı bulut altyapısı.",
    keywords:
      "cloud sunucu, bulut hizmetleri, vps, sanal sunucu, cloud depolama, CDN, kubernetes",
    canonical: "/cloud",
  },
  "/leasing": {
    title: "Kirala Senin Olsun - Sunucu Kiralama | ServerMarket",
    description:
      "Peşinatsız, sabit taksitlerle sunucu sahibi olun. 12-48 ay vade, garanti dahil. Kurumsal sunucu kiralama çözümleri.",
    keywords:
      "sunucu kiralama, kirala senin olsun, sunucu leasing, sunucu taksit, kurumsal kiralama",
    canonical: "/leasing",
  },
  "/hakkimizda": {
    title: "Hakkımızda | ServerMarket",
    description:
      "ServerMarket olarak 15 yılı aşkın süredir Türkiye'nin önde gelen kurumsal sunucu çözümleri sağlayıcısıyız.",
    keywords:
      "servermarket hakkında, sunucu firması, kurumsal çözümler, sunucu tedarikçi",
    canonical: "/hakkimizda",
  },
  "/iletisim": {
    title: "İletişim | ServerMarket",
    description:
      "ServerMarket ile iletişime geçin. Sunucu donanımı, colocation ve cloud hizmetleri için teklif alın. 7/24 teknik destek.",
    keywords:
      "iletişim, teklif al, sunucu satış, teknik destek, servermarket iletişim",
    canonical: "/iletisim",
  },
};

const configuratorServers = [
  { id: "dell-r740xd", name: "Dell PowerEdge R740xd" },
  { id: "dell-r640", name: "Dell PowerEdge R640" },
  { id: "hp-dl380", name: "HP ProLiant DL380 Gen10" },
  { id: "supermicro-2u", name: "Supermicro SuperServer 2U" },
];

const dynamicConfiguratorRoutesMeta: Record<string, RouteMeta> = Object.fromEntries(
  configuratorServers.map((server) => {
    const path = `/yapilandirici/${server.id}`;
    return [
      path,
      {
        title: `${server.name} Yapılandır | ServerMarket`,
        description: `${server.name} sunucusunu özelleştirin. CPU, RAM, depolama ve daha fazlasını seçin.`,
        keywords: `${server.name.toLowerCase()}, sunucu yapılandırma, kurumsal sunucu`,
        canonical: path,
      },
    ];
  })
);

const routesMeta: Record<string, RouteMeta> = {
  ...staticRoutesMeta,
  ...dynamicConfiguratorRoutesMeta,
};

const replaceMetaTag = (html: string, regex: RegExp, replacement: string) => {
  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }
  return html.replace("</head>", `  ${replacement}\n  </head>`);
};

const buildRouteHtml = (html: string, meta: RouteMeta) => {
  const baseUrl = getBaseUrl();
  const fullUrl = `${baseUrl}${meta.canonical}`;
  const ogImage = meta.ogImage || `${baseUrl}/og-image.jpg`;

  let routeHtml = html;

  routeHtml = replaceMetaTag(routeHtml, /<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  routeHtml = replaceMetaTag(
    routeHtml,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${meta.description}" />`
  );
  routeHtml = replaceMetaTag(
    routeHtml,
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/,
    `<meta name="keywords" content="${meta.keywords || ""}" />`
  );
  routeHtml = replaceMetaTag(
    routeHtml,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${fullUrl}" />`
  );
  routeHtml = replaceMetaTag(
    routeHtml,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${meta.title}" />`
  );
  routeHtml = replaceMetaTag(
    routeHtml,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${meta.description}" />`
  );
  routeHtml = replaceMetaTag(
    routeHtml,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${fullUrl}" />`
  );
  routeHtml = replaceMetaTag(
    routeHtml,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${ogImage}" />`
  );
  routeHtml = replaceMetaTag(
    routeHtml,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${meta.title}" />`
  );
  routeHtml = replaceMetaTag(
    routeHtml,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${meta.description}" />`
  );
  routeHtml = replaceMetaTag(
    routeHtml,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${ogImage}" />`
  );

  return routeHtml;
};

export function seoPrerender(): Plugin {
  return {
    name: "seo-prerender",
    enforce: "post",
    generateBundle(_, bundle) {
      const indexHtml = bundle["index.html"];
      if (!indexHtml || indexHtml.type !== "asset") return;

      const html = indexHtml.source as string;

      for (const [route, meta] of Object.entries(routesMeta)) {
        const routeHtml = buildRouteHtml(html, meta);

        if (route === "/") {
          indexHtml.source = routeHtml;
          continue;
        }

        const routePath = route.slice(1);
        this.emitFile({
          type: "asset",
          fileName: `${routePath}/index.html`,
          source: routeHtml,
        });
      }
    },
  };
}
