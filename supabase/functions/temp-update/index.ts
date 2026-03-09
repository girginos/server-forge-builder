import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const dbUrl = Deno.env.get("EXTERNAL_DB_URL")!;
  const { default: postgres } = await import("https://deno.land/x/postgresjs@v3.4.5/mod.js");
  const pg = postgres(dbUrl, { max: 1 });

  try {
    const { sql } = await req.json();
    const result = await pg.unsafe(sql);
    const rows = Array.from(result);
    return new Response(JSON.stringify({ rows, count: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } finally {
    await pg.end();
  }
});
