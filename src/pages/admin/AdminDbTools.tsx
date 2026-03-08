import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Play, Database, Download, RefreshCw, TableIcon, Info } from "lucide-react";

const EDGE_URL = `https://ncwsvchxohbvthjmefmh.supabase.co/functions/v1/admin-db`;

async function callAdminDb(body: Record<string, any>) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Oturum bulunamadı");

  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Hata oluştu");
  return json;
}

export default function AdminDbTools() {
  return (
    <Tabs defaultValue="tables" className="space-y-4">
      <TabsList>
        <TabsTrigger value="tables" className="gap-2"><TableIcon className="h-4 w-4" /> Tablolar</TabsTrigger>
        <TabsTrigger value="sql" className="gap-2"><Database className="h-4 w-4" /> SQL Editör</TabsTrigger>
      </TabsList>
      <TabsContent value="tables"><TableViewer /></TabsContent>
      <TabsContent value="sql"><SqlEditor /></TabsContent>
    </Tabs>
  );
}

function TableViewer() {
  const [tables, setTables] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await callAdminDb({ action: "tables" });
      setTables(data.tables || []);
    } catch (e: any) {
      toast({ title: "Hata", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const loadTableInfo = async (name: string) => {
    setSelected(name);
    try {
      const data = await callAdminDb({ action: "table_info", table: name });
      setTableInfo(data);
    } catch (e: any) {
      toast({ title: "Hata", description: e.message, variant: "destructive" });
    }
  };

  const handleExport = async (tableName: string, format: "json" | "csv") => {
    try {
      const data = await callAdminDb({ action: "export", table: tableName });
      const rows = data.rows || [];

      let content: string;
      let mimeType: string;
      let ext: string;

      if (format === "csv") {
        if (rows.length === 0) { toast({ title: "Boş tablo" }); return; }
        const headers = Object.keys(rows[0]);
        const csvRows = [headers.join(","), ...rows.map((r: any) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))];
        content = csvRows.join("\n");
        mimeType = "text/csv";
        ext = "csv";
      } else {
        content = JSON.stringify(rows, null, 2);
        mimeType = "application/json";
        ext = "json";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tableName}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: `${tableName} dışa aktarıldı (${ext.toUpperCase()})` });
    } catch (e: any) {
      toast({ title: "Hata", description: e.message, variant: "destructive" });
    }
  };

  useEffect(() => { loadTables(); }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Veritabanı Tabloları</CardTitle>
          <Button size="sm" variant="outline" onClick={loadTables} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Yenile
          </Button>
        </CardHeader>
        <CardContent>
          {tables.length === 0 ? <p className="text-muted-foreground">Tablo bulunamadı.</p> : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {tables.map((t) => (
                <button
                  key={t.table_name}
                  onClick={() => loadTableInfo(t.table_name)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${selected === t.table_name ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                >
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{t.table_name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{t.column_count} sütun</Badge>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selected && tableInfo && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">{selected}</CardTitle>
              <p className="text-sm text-muted-foreground">{tableInfo.row_count} kayıt</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleExport(selected, "json")}>
                <Download className="h-4 w-4 mr-1" /> JSON
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExport(selected, "csv")}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-1"><Info className="h-4 w-4" /> Sütunlar</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sütun</TableHead>
                      <TableHead>Tip</TableHead>
                      <TableHead>Nullable</TableHead>
                      <TableHead>Varsayılan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableInfo.columns?.map((c: any) => (
                      <TableRow key={c.column_name}>
                        <TableCell className="font-mono text-sm">{c.column_name}</TableCell>
                        <TableCell><Badge variant="outline">{c.data_type}</Badge></TableCell>
                        <TableCell>{c.is_nullable === "YES" ? "✓" : "✗"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{c.column_default || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {tableInfo.policies?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">RLS Politikaları</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Politika</TableHead>
                        <TableHead>Komut</TableHead>
                        <TableHead>USING</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableInfo.policies.map((p: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-sm">{p.policyname}</TableCell>
                          <TableCell><Badge>{p.cmd}</Badge></TableCell>
                          <TableCell className="font-mono text-xs max-w-xs truncate">{p.qual || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SqlEditor() {
  const [sql, setSql] = useState("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const runQuery = async () => {
    if (!sql.trim()) return;
    setLoading(true);
    try {
      const data = await callAdminDb({ action: "query", sql: sql.trim() });
      setResult(data);
      setHistory((prev) => [sql.trim(), ...prev.filter((h) => h !== sql.trim())].slice(0, 20));
    } catch (e: any) {
      setResult({ error: e.message });
      toast({ title: "SQL Hatası", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">SQL Editör</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={6}
            className="font-mono text-sm"
            placeholder="SQL sorgunuzu yazın..."
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runQuery(); } }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Ctrl+Enter ile çalıştır</p>
            <Button onClick={runQuery} disabled={loading}>
              <Play className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> {loading ? "Çalıştırılıyor..." : "Çalıştır"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {result.error ? "Hata" : `Sonuç (${result.count ?? 0} kayıt)`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <p className="text-destructive font-mono text-sm">{result.error}</p>
            ) : result.rows?.length === 0 ? (
              <p className="text-muted-foreground">Sonuç yok (sorgu başarıyla çalıştı).</p>
            ) : (
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {result.columns?.map((col: string) => (
                        <TableHead key={col} className="font-mono text-xs">{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.rows?.map((row: any, i: number) => (
                      <TableRow key={i}>
                        {result.columns?.map((col: string) => (
                          <TableCell key={col} className="font-mono text-xs max-w-xs truncate">
                            {row[col] === null ? <span className="text-muted-foreground">NULL</span> : typeof row[col] === "object" ? JSON.stringify(row[col]) : String(row[col])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-lg">Geçmiş</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {history.map((h, i) => (
                <button key={i} onClick={() => setSql(h)} className="block w-full text-left font-mono text-xs p-2 rounded hover:bg-muted truncate">
                  {h}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
