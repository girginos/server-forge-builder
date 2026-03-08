import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  created_at: string;
}

interface TicketChatProps {
  ticketId: string;
  currentUserId: string;
  currentUserRole: "user" | "admin";
  ticketStatus?: string;
}

export default function TicketChat({ ticketId, currentUserId, currentUserRole, ticketStatus }: TicketChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages((data as unknown as Message[]) || []);
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      });

    const channel = supabase
      .channel(`ticket-${ticketId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ticket_messages", filter: `ticket_id=eq.${ticketId}` },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [ticketId]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    const { error } = await supabase.from("ticket_messages").insert({
      ticket_id: ticketId,
      sender_id: currentUserId,
      sender_role: currentUserRole,
      message: newMessage.trim(),
    } as any);
    setSending(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isClosed = ticketStatus === "closed";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
        <div className="space-y-3 min-h-0">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Henüz mesaj yok. İlk mesajı gönderin.
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            const isAdmin = msg.sender_role === "admin";
            return (
              <div key={msg.id} className={cn("flex gap-2", isMe ? "justify-end" : "justify-start")}>
                {!isMe && (
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                    isAdmin ? "bg-primary/10" : "bg-muted"
                  )}>
                    {isAdmin ? <Shield className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
                  </div>
                )}
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                )}>
                  {!isMe && (
                    <p className={cn("text-xs font-medium mb-1", isAdmin ? "text-primary" : "text-muted-foreground")}>
                      {isAdmin ? "Destek Ekibi" : "Kullanıcı"}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  <p className={cn(
                    "text-[10px] mt-1",
                    isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                  )}>
                    {new Date(msg.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      {isClosed ? (
        <div className="border-t px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">Bu talep kapatılmıştır.</p>
        </div>
      ) : (
        <div className="border-t px-4 py-3">
          <div className="flex gap-2 items-end">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mesajınızı yazın..."
              rows={1}
              className="min-h-[40px] max-h-[120px] resize-none"
            />
            <Button size="icon" onClick={handleSend} disabled={!newMessage.trim() || sending} className="shrink-0">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
