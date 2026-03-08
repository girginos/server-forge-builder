import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check - verify the user is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const userId = claimsData.claims.sub;

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { action, sql, table, data, format } = await req.json();
    const dbUrl = Deno.env.get("EXTERNAL_DB_URL")!;

    if (action === "query" && sql) {
      // Execute SQL via postgres
      const { default: postgres } = await import("https://deno.land/x/postgresjs@v3.4.5/mod.js");
      const pg = postgres(dbUrl, { max: 1 });
      try {
        const result = await pg.unsafe(sql);
        const rows = Array.from(result);
        const columns = result.columns?.map((c: any) => c.name) || (rows.length > 0 ? Object.keys(rows[0]) : []);
        return new Response(JSON.stringify({ rows, columns, count: rows.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } finally {
        await pg.end();
      }
    }

    if (action === "tables") {
      const { default: postgres } = await import("https://deno.land/x/postgresjs@v3.4.5/mod.js");
      const pg = postgres(dbUrl, { max: 1 });
      try {
        const tables = await pg.unsafe(`
          SELECT table_name, 
                 (SELECT count(*) FROM information_schema.columns c WHERE c.table_schema = 'public' AND c.table_name = t.table_name) as column_count
          FROM information_schema.tables t
          WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
          ORDER BY table_name
        `);
        return new Response(JSON.stringify({ tables: Array.from(tables) }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } finally {
        await pg.end();
      }
    }

    if (action === "table_info" && table) {
      const { default: postgres } = await import("https://deno.land/x/postgresjs@v3.4.5/mod.js");
      const pg = postgres(dbUrl, { max: 1 });
      try {
        const columns = await pg.unsafe(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = '${table.replace(/'/g, "''")}'
          ORDER BY ordinal_position
        `);
        const policies = await pg.unsafe(`
          SELECT policyname, cmd, qual, with_check
          FROM pg_policies
          WHERE schemaname = 'public' AND tablename = '${table.replace(/'/g, "''")}'
        `);
        const countResult = await pg.unsafe(`SELECT count(*) as total FROM public."${table.replace(/"/g, '""')}"`);
        return new Response(JSON.stringify({ columns: Array.from(columns), policies: Array.from(policies), row_count: countResult[0]?.total || 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } finally {
        await pg.end();
      }
    }

    if (action === "export" && table) {
      const { default: postgres } = await import("https://deno.land/x/postgresjs@v3.4.5/mod.js");
      const pg = postgres(dbUrl, { max: 1 });
      try {
        const rows = await pg.unsafe(`SELECT * FROM public."${table.replace(/"/g, '""')}" LIMIT 10000`);
        return new Response(JSON.stringify({ rows: Array.from(rows) }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } finally {
        await pg.end();
      }
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
