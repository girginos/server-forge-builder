
CREATE TABLE public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  sender_role text NOT NULL DEFAULT 'user' CHECK (sender_role IN ('user', 'admin')),
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of own tickets"
ON public.ticket_messages FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE support_tickets.id = ticket_messages.ticket_id
    AND support_tickets.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to own tickets"
ON public.ticket_messages FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid() AND
  sender_role = 'user' AND
  EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE support_tickets.id = ticket_messages.ticket_id
    AND support_tickets.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all messages"
ON public.ticket_messages FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can send messages"
ON public.ticket_messages FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid() AND
  sender_role = 'admin' AND
  has_role(auth.uid(), 'admin'::app_role)
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
