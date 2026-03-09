const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
};

const BASE = "https://ncwsvchxohbvthjmefmh.supabase.co/storage/v1/object/public/product-images/products";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const dbUrl = Deno.env.get("EXTERNAL_DB_URL");
    if (!dbUrl) {
      return new Response(JSON.stringify({ error: "No EXTERNAL_DB_URL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { default: postgres } = await import("https://deno.land/x/postgresjs@v3.4.5/mod.js");
    const pg = postgres(dbUrl, { max: 1 });

    try {
      // Update each product with its image
      const updates = [
        { name: 'Dell PowerEdge R740', img: `${BASE}/dell-r740.png` },
        { name: 'HPE ProLiant DL380 Gen10', img: `${BASE}/hpe-dl380.png` },
        { name: 'Supermicro SYS-1029P-WTR', img: `${BASE}/supermicro-1u.png` },
        { name: 'Dell PowerEdge R640 CTO', img: `${BASE}/dell-r640-cto.png` },
        { name: 'HPE DL360 Gen10 CTO', img: `${BASE}/dell-r640-cto.png` },
        { name: 'Intel Xeon Gold 5218 (16C/32T)', img: `${BASE}/xeon-gold.png` },
        { name: 'Intel Xeon Silver 4214 (12C/24T)', img: `${BASE}/xeon-gold.png` },
        { name: 'AMD EPYC 7302 (16C/32T)', img: `${BASE}/amd-epyc.png` },
        { name: 'Samsung 32GB DDR4 ECC RDIMM 2933MHz', img: `${BASE}/samsung-ram.png` },
        { name: 'Micron 64GB DDR4 ECC LRDIMM 2666MHz', img: `${BASE}/samsung-ram.png` },
        { name: 'Samsung PM883 960GB SSD SATA', img: `${BASE}/ssd-sata.png` },
        { name: 'Seagate Exos 2TB SAS 7.2K', img: `${BASE}/ssd-sata.png` },
        { name: 'Intel P4510 2TB NVMe U.2', img: `${BASE}/nvme-u2.png` },
        { name: 'Intel X710-DA2 10GbE SFP+ Dual Port', img: `${BASE}/intel-nic.png` },
        { name: 'Mellanox ConnectX-5 25GbE SFP28', img: `${BASE}/intel-nic.png` },
        { name: 'Cisco Catalyst 2960X-24PS-L', img: `${BASE}/cisco-switch.png` },
        { name: 'MikroTik CRS326-24G-2S+RM', img: `${BASE}/cisco-switch.png` },
        { name: '10G SFP+ DAC Kablo 3m', img: `${BASE}/dac-cable.png` },
        { name: 'OM4 Fiber Optik Patch Kablo 5m LC-LC', img: `${BASE}/dac-cable.png` },
        { name: 'Supermicro X11DPH-T (Dual Socket LGA3647)', img: `${BASE}/supermicro-mobo.png` },
        { name: 'ASUS WS C621E SAGE', img: `${BASE}/supermicro-mobo.png` },
      ];

      const results = [];
      for (const u of updates) {
        const r = await pg.unsafe(
          `UPDATE admin_products SET image_url = '${u.img}', images = ARRAY['${u.img}'] WHERE name = '${u.name.replace(/'/g, "''")}' RETURNING id, name`
        );
        results.push(...Array.from(r));
      }

      return new Response(JSON.stringify({ success: true, updated: results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } finally {
      await pg.end();
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
