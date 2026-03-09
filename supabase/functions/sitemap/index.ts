import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://server.girginos.net";

const HARDWARE_CATEGORIES: Record<string, string> = {
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

const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/hardware", changefreq: "weekly", priority: "0.9" },
  { loc: "/hardware/cto-sunucular", changefreq: "weekly", priority: "0.8" },
  { loc: "/hardware/disk", changefreq: "weekly", priority: "0.8" },
  { loc: "/hardware/cpu", changefreq: "weekly", priority: "0.8" },
  { loc: "/hardware/ram", changefreq: "weekly", priority: "0.8" },
  { loc: "/hardware/ethernet-kartlari", changefreq: "weekly", priority: "0.8" },
  { loc: "/hardware/switch-router", changefreq: "weekly", priority: "0.8" },
  { loc: "/hardware/kablo", changefreq: "weekly", priority: "0.8" },
  { loc: "/hardware/anakart", changefreq: "weekly", priority: "0.8" },
  { loc: "/hazir-paketler", changefreq: "weekly", priority: "0.8" },
  { loc: "/yapilandirici", changefreq: "monthly", priority: "0.8" },
  { loc: "/colocation", changefreq: "monthly", priority: "0.8" },
  { loc: "/cloud", changefreq: "monthly", priority: "0.8" },
  { loc: "/leasing", changefreq: "monthly", priority: "0.7" },
  { loc: "/hakkimizda", changefreq: "monthly", priority: "0.5" },
  { loc: "/iletisim", changefreq: "monthly", priority: "0.6" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products } = await supabase
      .from("admin_products")
      .select("slug, category, updated_at")
      .order("updated_at", { ascending: false });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Product pages
    if (products) {
      for (const p of products) {
        const catSlug = HARDWARE_CATEGORIES[p.category] || p.category;
        const lastmod = p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : "";
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/urun/${catSlug}/${p.slug}</loc>\n`;
        if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(`Error generating sitemap: ${error.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
