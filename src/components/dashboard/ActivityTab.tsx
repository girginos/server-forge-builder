import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, HeadphonesIcon, UserCog, LogIn, Activity } from "lucide-react";

interface ActivityItem {
  id: string;
  icon: React.ElementType;
  title: string;
  detail: string;
  time: string;
  color: string;
}

export default function ActivityTab({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Build activity timeline from orders + support tickets
    Promise.all([
      supabase.from("orders").select("id, status, created_at, total_amount").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
      supabase.from("support_tickets").select("id, subject, status, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
    ]).then(([ordersRes, ticketsRes]) => {
      const items: ActivityItem[] = [];

      ((ordersRes.data as any[]) || []).forEach((o) => {
        const statusLabels: Record<string, string> = {
          pending: "oluşturuldu",
          processing: "işleme alındı",
          shipped: "kargoya verildi",
          delivered: "teslim edildi",
          cancelled: "iptal edildi",
        };
        items.push({
          id: `order-${o.id}`,
          icon: ShoppingCart,
          title: `Sipariş ${statusLabels[o.status] || o.status}`,
          detail: `#${o.id.slice(0, 8).toUpperCase()} — ${o.total_amount.toLocaleString("tr-TR")} ₺`,
          time: o.created_at,
          color: "text-primary",
        });
      });

      ((ticketsRes.data as any[]) || []).forEach((t) => {
        items.push({
          id: `ticket-${t.id}`,
          icon: HeadphonesIcon,
          title: `Destek talebi: ${t.subject}`,
          detail: t.status === "closed" ? "Kapatıldı" : t.status === "in_progress" ? "İşlemde" : "Açıldı",
          time: t.created_at,
          color: "text-accent",
        });
      });

      // Sort by time descending
      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setActivities(items.slice(0, 30));
      setIsLoading(false);
    });
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="space-y-1 flex-1">
              <div className="h-4 w-48 bg-muted rounded" />
              <div className="h-3 w-32 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold mb-1">Henüz aktivite yok</h3>
          <p className="text-sm text-muted-foreground">Sipariş ve destek işlemleriniz burada kronolojik olarak listelenecektir.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-5 bottom-5 w-px bg-border" />

      <div className="space-y-1">
        {activities.map((item, idx) => {
          const Icon = item.icon;
          const date = new Date(item.time);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={item.id} className="flex items-start gap-4 pl-0 py-3 relative">
              <div className="h-10 w-10 shrink-0 rounded-full bg-card border-2 border-border flex items-center justify-center z-10">
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {isToday
                  ? date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
                  : date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
