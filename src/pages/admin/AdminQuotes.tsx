import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { RefreshCw, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QuoteRequest {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  items: any[];
  total_amount: number;
  billing_type: string;
  address: string | null;
  city: string | null;
  tax_office: string | null;
  tax_number: string | null;
  note: string | null;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Bekliyor", variant: "secondary" as const },
  { value: "reviewed", label: "İncelendi", variant: "outline" as const },
  { value: "quoted", label: "Teklif Verildi", variant: "default" as const },
  { value: "accepted", label: "Kabul Edildi", variant: "default" as const },
  { value: "rejected", label: "Reddedildi", variant: "destructive" as const },
];

function statusBadge(status: string) {
  const opt = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
  return <Badge variant={opt.variant}>{opt.label}</Badge>;
}

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<QuoteRequest | null>(null);

  const fetchQuotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quote_requests" as any)
      .select("*")
      .order("created_at", { ascending: false }) as any;
    if (error) toast.error(error.message);
    else setQuotes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("quote_requests" as any)
      .update({ status, updated_at: new Date().toISOString() } as any)
      .eq("id", id) as any;
    if (error) toast.error(error.message);
    else {
      setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status } : q));
      toast.success("Durum güncellendi");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Teklif Talepleri ({quotes.length})</h2>
        <Button variant="outline" size="sm" onClick={fetchQuotes} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Yenile
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarih</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead className="text-right">Tutar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 && !loading && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Henüz teklif talebi yok.</TableCell></TableRow>
            )}
            {quotes.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(q.created_at), "dd MMM yyyy HH:mm", { locale: tr })}
                </TableCell>
                <TableCell className="font-medium text-foreground">{q.name}{q.company && <span className="text-muted-foreground text-xs ml-1">({q.company})</span>}</TableCell>
                <TableCell className="text-sm">{q.email}</TableCell>
                <TableCell className="text-right font-mono font-bold">₺{q.total_amount.toLocaleString("tr-TR")}</TableCell>
                <TableCell>
                  <Select value={q.status} onValueChange={(v) => updateStatus(q.id, v)}>
                    <SelectTrigger className="h-8 w-36 text-xs">{statusBadge(q.status)}</SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(q)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Teklif Detayı</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Ad:</span> <span className="font-medium">{selected.name}</span></div>
                {selected.company && <div><span className="text-muted-foreground">Şirket:</span> <span className="font-medium">{selected.company}</span></div>}
                <div><span className="text-muted-foreground">E-posta:</span> <span className="font-medium">{selected.email}</span></div>
                <div><span className="text-muted-foreground">Telefon:</span> <span className="font-medium">{selected.phone}</span></div>
                <div><span className="text-muted-foreground">Fatura:</span> <span className="font-medium">{selected.billing_type === "corporate" ? "Kurumsal" : "Bireysel"}</span></div>
                {selected.city && <div><span className="text-muted-foreground">Şehir:</span> <span className="font-medium">{selected.city}</span></div>}
                {selected.tax_office && <div><span className="text-muted-foreground">Vergi Dairesi:</span> <span className="font-medium">{selected.tax_office}</span></div>}
                {selected.tax_number && <div><span className="text-muted-foreground">Vergi No:</span> <span className="font-medium">{selected.tax_number}</span></div>}
              </div>
              {selected.address && <div><span className="text-muted-foreground">Adres:</span> <p className="font-medium">{selected.address}</p></div>}
              {selected.note && <div><span className="text-muted-foreground">Not:</span> <p className="font-medium">{selected.note}</p></div>}
              <div className="border-t pt-3 space-y-1">
                <h4 className="font-semibold">Ürünler</h4>
                {(selected.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                    <span className="font-mono">₺{(item.price * item.quantity).toLocaleString("tr-TR")}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Toplam</span>
                  <span>₺{selected.total_amount.toLocaleString("tr-TR")}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
