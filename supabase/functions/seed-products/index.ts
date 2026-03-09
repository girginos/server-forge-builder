const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
};

function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  };
  return text
    .split('')
    .map(c => trMap[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const dbUrl = Deno.env.get("EXTERNAL_DB_URL");
    if (!dbUrl) return new Response(JSON.stringify({ error: "No DB URL" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { default: postgres } = await import("https://deno.land/x/postgresjs@v3.4.5/mod.js");
    const pg = postgres(dbUrl, { max: 1 });

    try {
      // 1. Add slug column if not exists
      await pg.unsafe(`
        ALTER TABLE admin_products ADD COLUMN IF NOT EXISTS slug text;
        CREATE UNIQUE INDEX IF NOT EXISTS admin_products_slug_idx ON admin_products(slug);
      `);

      // 2. Get all products without slugs
      const products = await pg.unsafe(`SELECT id, name FROM admin_products WHERE slug IS NULL OR slug = ''`);
      
      // 3. Generate and update slugs
      const results = [];
      for (const p of Array.from(products) as any[]) {
        const slug = slugify(p.name);
        await pg.unsafe(`UPDATE admin_products SET slug = '${slug}' WHERE id = '${p.id}'`);
        results.push({ id: p.id, name: p.name, slug });
      }

      return new Response(JSON.stringify({ success: true, updated: results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } finally {
      await pg.end();
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
