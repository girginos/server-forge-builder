import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  specs: Record<string, string>;
  image_url: string | null;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

const emptyProduct = { name: "", description: "", category: "server", price: 0, specs: "{}", image_url: "", in_stock: true, featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = () => {
    supabase.from("admin_products").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setProducts((data as unknown as Product[]) || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyProduct); setDialogOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", category: p.category, price: p.price, specs: JSON.stringify(p.specs, null, 2), image_url: p.image_url || "", in_stock: p.in_stock, featured: p.featured });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    let specs = {};
    try { specs = JSON.parse(form.specs || "{}"); } catch { /* ignore */ }

    const payload = { name: form.name, description: form.description || null, category: form.category, price: form.price, specs, image_url: form.image_url || null, in_stock: form.in_stock, featured: form.featured, updated_at: new Date().toISOString() } as any;

    const { error } = editing
      ? await supabase.from("admin_products").update(payload).eq("id", editing.id)
      : await supabase.from("admin_products").insert(payload);

    setSaving(false);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    toast({ title: editing ? "Güncellendi" : "Eklendi" });
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("admin_products").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ürün Yönetimi</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Yeni Ürün</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Ürün Düzenle" : "Yeni Ürün"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Ürün Adı *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Kategori</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div className="space-y-2"><Label>Fiyat (₺)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Açıklama</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><Label>Özellikler (JSON)</Label><Textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={4} placeholder='{"cpu": "Intel Xeon", "ram": "64GB"}' /></div>
              <div className="space-y-2"><Label>Görsel URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.in_stock} onCheckedChange={(v) => setForm({ ...form, in_stock: v })} /><Label>Stokta</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /><Label>Öne Çıkan</Label></div>
              </div>
              <Button onClick={handleSave} disabled={saving || !form.name} className="w-full">{saving ? "Kaydediliyor..." : "Kaydet"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Yükleniyor...</p> : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Henüz ürün eklenmemiş.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.price.toLocaleString("tr-TR")} ₺</TableCell>
                    <TableCell>
                      <Badge variant={p.in_stock ? "default" : "secondary"}>{p.in_stock ? "Stokta" : "Tükendi"}</Badge>
                      {p.featured && <Badge variant="outline" className="ml-1">Öne Çıkan</Badge>}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
