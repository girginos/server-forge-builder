import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  city: string | null;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setUsers((data as unknown as Profile[]) || []);
      setIsLoading(false);
    });
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Kullanıcı Yönetimi</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <p>Yükleniyor...</p> : users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Henüz kullanıcı yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Şirket</TableHead>
                  <TableHead>Şehir</TableHead>
                  <TableHead>Kayıt Tarihi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name || "-"}</TableCell>
                    <TableCell>{u.phone || "-"}</TableCell>
                    <TableCell>{u.company || "-"}</TableCell>
                    <TableCell>{u.city || "-"}</TableCell>
                    <TableCell>{new Date(u.created_at).toLocaleDateString("tr-TR")}</TableCell>
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
