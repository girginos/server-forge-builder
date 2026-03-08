import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, HeadphonesIcon } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, tickets: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("admin_products").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("support_tickets").select("id", { count: "exact", head: true }),
    ]).then(([p, u, o, t]) => {
      setStats({
        products: p.count ?? 0,
        users: u.count ?? 0,
        orders: o.count ?? 0,
        tickets: t.count ?? 0,
      });
    });
  }, []);

  const cards = [
    { label: "Ürünler", value: stats.products, icon: Package, color: "text-blue-500" },
    { label: "Kullanıcılar", value: stats.users, icon: Users, color: "text-green-500" },
    { label: "Siparişler", value: stats.orders, icon: ShoppingCart, color: "text-orange-500" },
    { label: "Destek Talepleri", value: stats.tickets, icon: HeadphonesIcon, color: "text-purple-500" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
            <c.icon className={`h-5 w-5 ${c.color}`} />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
