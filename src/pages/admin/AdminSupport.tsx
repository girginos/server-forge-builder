import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare } from "lucide-react";
import TicketChat from "@/components/TicketChat";

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

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  open: "default",
  in_progress: "outline",
  closed: "secondary",
};

export default function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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
    if (selectedTicket?.id === id) setSelectedTicket((prev) => prev ? { ...prev, status } : null);
    toast({ title: "Güncellendi" });
  };

  return (
    <>
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
                    <TableHead className="w-20">Sohbet</TableHead>
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
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTicket(t)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-lg h-[70vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="text-base truncate">{selectedTicket?.subject}</DialogTitle>
              {selectedTicket && (
                <Badge variant={statusVariant[selectedTicket.status] || "secondary"}>
                  {statuses.find((s) => s.value === selectedTicket.status)?.label || selectedTicket.status}
                </Badge>
              )}
            </div>
          </DialogHeader>
          {selectedTicket && user && (
            <TicketChat
              ticketId={selectedTicket.id}
              currentUserId={user.id}
              currentUserRole="admin"
              ticketStatus={selectedTicket.status}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
