import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const statuses = [
  { value: "open", label: "Açık" },
  { value: "in_progress", label: "İşlemde" },
  { value: "closed", label: "Kapalı" },
];

export default function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("support_tickets").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setTickets((data as unknown as Ticket[]) || []);
      setIsLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("support_tickets").update({ status, updated_at: new Date().toISOString() } as any).eq("id", id);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    toast({ title: "Güncellendi" });
  };

  return (
    <Card>
      <CardHeader><CardTitle>Destek Talepleri</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <p>Yükleniyor...</p> : tickets.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Henüz destek talebi yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Konu</TableHead>
                  <TableHead>Mesaj</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{new Date(t.created_at).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell className="font-medium">{t.subject}</TableCell>
                    <TableCell className="max-w-xs truncate">{t.message}</TableCell>
                    <TableCell>
                      <Select value={t.status} onValueChange={(v) => updateStatus(t.id, v)}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
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
