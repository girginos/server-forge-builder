import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  order_id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function InvoicesTab({ userId }: { userId: string }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Invoices are derived from orders with "delivered" or "processing" status
    supabase
      .from("orders")
      .select("id, total_amount, status, created_at")
      .eq("user_id", userId)
      .in("status", ["delivered", "processing", "shipped"])
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const mapped = ((data as any[]) || []).map((o) => ({
          id: `INV-${o.id.slice(0, 8).toUpperCase()}`,
          order_id: o.id,
          total_amount: o.total_amount,
          status: o.status === "delivered" ? "paid" : "pending",
          created_at: o.created_at,
        }));
        setInvoices(mapped);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2].map((i) => (
          <Card key={i}><CardContent className="py-6"><div className="h-12 bg-muted rounded" /></CardContent></Card>
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold mb-1">Henüz faturanız yok</h3>
          <p className="text-sm text-muted-foreground">Siparişleriniz onaylandığında faturalar burada görünecektir.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((inv) => (
        <Card key={inv.order_id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{inv.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(inv.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={inv.status === "paid" ? "default" : "secondary"}>
                  {inv.status === "paid" ? "Ödendi" : "Beklemede"}
                </Badge>
                <span className="font-semibold text-sm">{inv.total_amount.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
