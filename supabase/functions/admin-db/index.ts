import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// External Supabase credentials (same as client-side, publishable keys)
const EXTERNAL_URL = "https://merqyvrpmjymyftgfcmg.supabase.co";
const EXTERNAL_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcnF5dnJwbWp5bXlmdGdmY21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTQzNjgsImV4cCI6MjA4NjU5MDM2OH0.yC0YABZ0WWHTr-JlXbXOoB_dnlwF_G4YW1mF_t9Cp0Q";

async function authenticateRequest(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  console.log("Auth header present:", !!authHeader);
  console.log("Auth header prefix:", authHeader?.substring(0, 20));
  console.log("x-admin-api-key present:", !!req.headers.get("x-admin-api-key"));
  console.log("ADMIN_API_KEY env present:", !!Deno.env.get("ADMIN_API_KEY"));
  console.log("SERVICE_ROLE_KEY env present:", !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  const token = authHeader?.replace("Bearer ", "") || "";
  const srk = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  console.log("Token last10:", token.slice(-10));
  console.log("SRK last10:", srk.slice(-10));
  console.log("Match:", token === srk);
  // Method 1: API Key authentication (for server-side/automation)
  const apiKey = req.headers.get("x-admin-api-key");
  const storedApiKey = Deno.env.get("ADMIN_API_KEY");
  if (apiKey && storedApiKey && apiKey === storedApiKey) {
    return true;
  }

  // Method 2: Service role key (for Lovable Cloud automation)
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (authHeader && serviceRoleKey && authHeader === `Bearer ${serviceRoleKey}`) {
    return true;
  }

  // Method 3: User token + admin role check (for browser/admin panel)
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }

  const supabase = createClient(EXTERNAL_URL, EXTERNAL_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return false;

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  return !!roleData;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const isAuthorized = await authenticateRequest(req);
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { action, sql, table, data, format } = await req.json();
    const dbUrl = Deno.env.get("EXTERNAL_DB_URL")!;

    if (action === "query" && sql) {
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
