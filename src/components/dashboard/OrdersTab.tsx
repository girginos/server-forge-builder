import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  items: any;
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Beklemede", variant: "secondary" },
  processing: { label: "İşleniyor", variant: "default" },
  shipped: { label: "Kargoda", variant: "outline" },
  delivered: { label: "Teslim Edildi", variant: "default" },
  cancelled: { label: "İptal Edildi", variant: "destructive" },
};

export default function OrdersTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data as unknown as Order[]) || []);
      setIsLoading(false);
    });
  }, [userId]);

  if (isLoading) return <OrdersSkeleton />;

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold mb-1">Henüz siparişiniz yok</h3>
          <p className="text-sm text-muted-foreground">İlk siparişinizi verdikten sonra burada görünecektir.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Toplam {orders.length} sipariş</h3>
      </div>

      {orders.map((order) => {
        const status = statusMap[order.status] || { label: order.status, variant: "secondary" as const };
        const isExpanded = expandedOrder === order.id;
        const items = Array.isArray(order.items) ? order.items : [];

        return (
          <Card key={order.id} className="overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={status.variant}>{status.label}</Badge>
                <span className="font-semibold text-sm">{order.total_amount.toLocaleString("tr-TR")} ₺</span>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>

            {isExpanded && (
              <div className="border-t px-4 pb-4 pt-3 bg-muted/20">
                {items.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ürün</TableHead>
                        <TableHead className="text-right">Adet</TableHead>
                        <TableHead className="text-right">Tutar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="text-sm">{item.name || "Ürün"}</TableCell>
                          <TableCell className="text-right text-sm">{item.quantity || 1}</TableCell>
                          <TableCell className="text-right text-sm">{(item.price || 0).toLocaleString("tr-TR")} ₺</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">Sipariş detayları mevcut değil.</p>
                )}
                {order.notes && (
                  <p className="text-sm text-muted-foreground mt-3">
                    <span className="font-medium">Not:</span> {order.notes}
                  </p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <Card key={i}><CardContent className="py-6"><div className="h-10 bg-muted rounded" /></CardContent></Card>
      ))}
    </div>
  );
}
