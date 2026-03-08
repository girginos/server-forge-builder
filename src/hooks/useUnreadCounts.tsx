import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface UnreadCounts {
  [ticketId: string]: number;
}

export function useUnreadCounts(ticketIds: string[], userId: string | undefined) {
  const [counts, setCounts] = useState<UnreadCounts>({});

  const fetchCounts = useCallback(async () => {
    if (!userId || ticketIds.length === 0) return;

    // Get read statuses for all tickets
    const { data: readStatuses } = await supabase
      .from("ticket_read_status")
      .select("ticket_id, last_read_at")
      .eq("user_id", userId)
      .in("ticket_id", ticketIds);

    const readMap: Record<string, string> = {};
    (readStatuses || []).forEach((rs: any) => {
      readMap[rs.ticket_id] = rs.last_read_at;
    });

    // For each ticket, count messages after last_read_at
    const newCounts: UnreadCounts = {};
    await Promise.all(
      ticketIds.map(async (ticketId) => {
        const lastRead = readMap[ticketId];
        let query = supabase
          .from("ticket_messages")
          .select("id", { count: "exact", head: true })
          .eq("ticket_id", ticketId)
          .neq("sender_id", userId);

        if (lastRead) {
          query = query.gt("created_at", lastRead);
        }

        const { count } = await query;
        newCounts[ticketId] = count || 0;
      })
    );

    setCounts(newCounts);
  }, [ticketIds.join(","), userId]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Listen for new messages in realtime
  useEffect(() => {
    if (!userId || ticketIds.length === 0) return;

    const channel = supabase
      .channel("unread-counter")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ticket_messages" },
        (payload) => {
          const msg = payload.new as any;
          if (ticketIds.includes(msg.ticket_id) && msg.sender_id !== userId) {
            setCounts((prev) => ({
              ...prev,
              [msg.ticket_id]: (prev[msg.ticket_id] || 0) + 1,
            }));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [ticketIds.join(","), userId]);

  const markAsRead = useCallback(async (ticketId: string) => {
    if (!userId) return;
    const now = new Date().toISOString();

    await supabase
      .from("ticket_read_status")
      .upsert(
        { ticket_id: ticketId, user_id: userId, last_read_at: now } as any,
        { onConflict: "ticket_id,user_id" }
      );

    setCounts((prev) => ({ ...prev, [ticketId]: 0 }));
  }, [userId]);

  return { counts, markAsRead, refetch: fetchCounts };
}
