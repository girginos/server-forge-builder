import { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";

interface RouteMeta {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogImage?: string;
}

const routesMeta: Record<string, RouteMeta> = {
  "/": {
    title: "Kurumsal Sunucu Donanım Çözümleri | ServerMarket",
    description: "Türkiye'nin güvenilir sunucu donanım tedarikçisi. Dell, HP, Supermicro sunucu satışı, yapılandırma, colocation ve cloud hizmetleri.",
    keywords: "sunucu satış, server donanım, dell poweredge, hp proliant, supermicro, sunucu yapılandırma, colocation",
    canonical: "/",
  },
  "/hardware": {
    title: "Sunucu Donanımları | ServerMarket",
    description: "Dell, HP, Supermicro sunucu donanımları. Marka, fiyat ve form faktörüne göre filtreleyin, ihtiyacınıza uygun sunucuyu bulun.",
    keywords: "sunucu donanım, dell poweredge, hp proliant, supermicro, rack sunucu, 1u sunucu, 2u sunucu",
    canonical: "/hardware",
  },
  "/hazir-paketler": {
    title: "Hazır Sunucu Paketleri | ServerMarket",
    description: "İş yükünüze göre optimize edilmiş hazır sunucu paketleri. Web, veritabanı, sanallaştırma, AI ve depolama sunucuları.",
    keywords: "hazır sunucu, sunucu paketi, web sunucu, veritabanı sunucu, sanallaştırma sunucu, AI sunucu",
    canonical: "/hazir-paketler",
  },
  "/yapilandirici": {
    title: "Sunucu Yapılandırıcı | ServerMarket",
    description: "Sunucunuzu özelleştirin. CPU, RAM, depolama, RAID, ağ kartı ve güç kaynağı seçenekleriyle ihtiyacınıza özel sunucu yapılandırın.",
    keywords: "sunucu yapılandırma, server configurator, özel sunucu, sunucu özelleştirme",
    canonical: "/yapilandirici",
  },
  "/colocation": {
    title: "Colocation Hizmetleri | ServerMarket",
    description: "Tier III+ veri merkezlerinde sunucu barındırma. Yedekli güç, 7/24 güvenlik, yüksek bant genişliği ile kesintisiz colocation hizmetleri.",
    keywords: "colocation, sunucu barındırma, veri merkezi, datacenter, server hosting, rack kirala",
    canonical: "/colocation",
  },
  "/cloud": {
    title: "Cloud Çözümleri | ServerMarket",
    description: "Ölçeklenebilir cloud sunucu, depolama ve CDN hizmetleri. Esnek, güvenli ve yüksek performanslı bulut altyapısı.",
    keywords: "cloud sunucu, bulut hizmetleri, vps, sanal sunucu, cloud depolama, CDN, kubernetes",
    canonical: "/cloud",
  },
  "/leasing": {
    title: "Kirala Senin Olsun - Sunucu Kiralama | ServerMarket",
    description: "Peşinatsız, sabit taksitlerle sunucu sahibi olun. 12-48 ay vade, garanti dahil. Kurumsal sunucu kiralama çözümleri.",
    keywords: "sunucu kiralama, kirala senin olsun, sunucu leasing, sunucu taksit, kurumsal kiralama",
    canonical: "/leasing",
  },
  "/hakkimizda": {
    title: "Hakkımızda | ServerMarket",
    description: "ServerMarket olarak 15 yılı aşkın süredir Türkiye'nin önde gelen kurumsal sunucu çözümleri sağlayıcısıyız.",
    keywords: "servermarket hakkında, sunucu firması, kurumsal çözümler, sunucu tedarikçi",
    canonical: "/hakkimizda",
  },
  "/iletisim": {
    title: "İletişim | ServerMarket",
    description: "ServerMarket ile iletişime geçin. Sunucu donanımı, colocation ve cloud hizmetleri için teklif alın. 7/24 teknik destek.",
    keywords: "iletişim, teklif al, sunucu satış, teknik destek, servermarket iletişim",
    canonical: "/iletisim",
  },
};

const baseUrl = "https://servermarket.com.tr";

export function seoPrerender(): Plugin {
  return {
    name: "seo-prerender",
    enforce: "post",
    generateBundle(_, bundle) {
      const indexHtml = bundle["index.html"];
      if (!indexHtml || indexHtml.type !== "asset") return;

      const html = indexHtml.source as string;

      for (const [route, meta] of Object.entries(routesMeta)) {
        if (route === "/") continue; // index.html already covers "/"

        const fullUrl = `${baseUrl}${meta.canonical}`;
        const ogImage = meta.ogImage || `${baseUrl}/og-image.jpg`;

        let routeHtml = html;

        // Replace title
        routeHtml = routeHtml.replace(
          /<title>[^<]*<\/title>/,
          `<title>${meta.title}</title>`
        );

        // Replace meta description
        routeHtml = routeHtml.replace(
          /<meta name="description" content="[^"]*"/,
          `<meta name="description" content="${meta.description}"`
        );

        // Replace/add keywords
        if (meta.keywords) {
          if (routeHtml.includes('name="keywords"')) {
            routeHtml = routeHtml.replace(
              /<meta name="keywords" content="[^"]*"/,
              `<meta name="keywords" content="${meta.keywords}"`
            );
          } else {
            routeHtml = routeHtml.replace(
              '</head>',
              `  <meta name="keywords" content="${meta.keywords}" />\n  </head>`
            );
          }
        }

        // Replace canonical
        routeHtml = routeHtml.replace(
          /<link rel="canonical" href="[^"]*"/,
          `<link rel="canonical" href="${fullUrl}"`
        );

        // Replace OG tags
        routeHtml = routeHtml.replace(
          /<meta property="og:title" content="[^"]*"/,
          `<meta property="og:title" content="${meta.title}"`
        );
        routeHtml = routeHtml.replace(
          /<meta property="og:description" content="[^"]*"/,
          `<meta property="og:description" content="${meta.description}"`
        );
        routeHtml = routeHtml.replace(
          /<meta property="og:url" content="[^"]*"/,
          `<meta property="og:url" content="${fullUrl}"`
        );
        routeHtml = routeHtml.replace(
          /<meta property="og:image" content="[^"]*"/,
          `<meta property="og:image" content="${ogImage}"`
        );

        // Replace Twitter tags
        routeHtml = routeHtml.replace(
          /<meta name="twitter:title" content="[^"]*"/,
          `<meta name="twitter:title" content="${meta.title}"`
        );
        routeHtml = routeHtml.replace(
          /<meta name="twitter:description" content="[^"]*"/,
          `<meta name="twitter:description" content="${meta.description}"`
        );
        routeHtml = routeHtml.replace(
          /<meta name="twitter:image" content="[^"]*"/,
          `<meta name="twitter:image" content="${ogImage}"`
        );

        // Emit route-specific HTML files
        const routePath = route.slice(1); // remove leading /
        this.emitFile({
          type: "asset",
          fileName: `${routePath}/index.html`,
          source: routeHtml,
        });
      }
    },
  };
}
