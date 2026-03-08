import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { HeadphonesIcon, Plus, MessageSquare, Clock } from "lucide-react";
import TicketChat from "@/components/TicketChat";
import { useUnreadCounts } from "@/hooks/useUnreadCounts";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  open: { label: "Açık", variant: "default" },
  in_progress: { label: "İşlemde", variant: "outline" },
  closed: { label: "Kapalı", variant: "secondary" },
};

export default function SupportTab({ userId }: { userId: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chatTicket, setChatTicket] = useState<Ticket | null>(null);
  const { toast } = useToast();

  const loadTickets = () => {
    supabase.from("support_tickets").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => {
      setTickets((data as unknown as Ticket[]) || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadTickets(); }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setIsSubmitting(true);
    const { error } = await supabase.from("support_tickets").insert({ user_id: userId, subject: subject.trim(), message: message.trim() } as any);
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Talep oluşturuldu", description: "Destek ekibimiz en kısa sürede dönüş yapacaktır." });
      setSubject("");
      setMessage("");
      setDialogOpen(false);
      loadTickets();
    }
  };

  if (isLoading) return <SupportSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Destek Talepleri ({tickets.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Yeni Talep</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Destek Talebi</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Konu *</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Sorununuzu kısaca özetleyin" />
              </div>
              <div className="space-y-2">
                <Label>Mesaj *</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder="Detaylı açıklama yazın..." />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Gönderiliyor..." : "Talep Oluştur"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <HeadphonesIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold mb-1">Henüz destek talebiniz yok</h3>
            <p className="text-sm text-muted-foreground mb-4">Bir sorunla karşılaştığınızda yeni talep oluşturabilirsiniz.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const status = statusMap[ticket.status] || { label: ticket.status, variant: "secondary" as const };
            return (
              <Card
                key={ticket.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setChatTicket(ticket)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-accent/50 flex items-center justify-center mt-0.5">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{ticket.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(ticket.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Chat Dialog */}
      <Dialog open={!!chatTicket} onOpenChange={(open) => !open && setChatTicket(null)}>
        <DialogContent className="max-w-lg h-[70vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="text-base truncate">{chatTicket?.subject}</DialogTitle>
              {chatTicket && (
                <Badge variant={statusMap[chatTicket.status]?.variant || "secondary"}>
                  {statusMap[chatTicket.status]?.label || chatTicket.status}
                </Badge>
              )}
            </div>
          </DialogHeader>
          {chatTicket && (
            <TicketChat
              ticketId={chatTicket.id}
              currentUserId={userId}
              currentUserRole="user"
              ticketStatus={chatTicket.status}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SupportSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <Card key={i}><CardContent className="py-6"><div className="h-12 bg-muted rounded" /></CardContent></Card>
      ))}
    </div>
  );
}
