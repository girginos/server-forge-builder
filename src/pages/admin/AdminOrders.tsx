import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  user_id: string;
  items: any;
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
}

const statuses = [
  { value: "pending", label: "Beklemede" },
  { value: "processing", label: "İşleniyor" },
  { value: "shipped", label: "Kargoda" },
  { value: "delivered", label: "Teslim Edildi" },
  { value: "cancelled", label: "İptal" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data as unknown as Order[]) || []);
      setIsLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() } as any).eq("id", id);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast({ title: "Güncellendi" });
  };

  return (
    <Card>
      <CardHeader><CardTitle>Sipariş Yönetimi</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <p>Yükleniyor...</p> : orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Henüz sipariş yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Sipariş No</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{new Date(o.created_at).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell className="font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{o.total_amount.toLocaleString("tr-TR")} ₺</TableCell>
                    <TableCell>
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
