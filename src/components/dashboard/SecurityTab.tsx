import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Key, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function SecurityTab({ userId, email }: { userId: string; email: string }) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "Hata", description: "Şifre en az 6 karakter olmalıdır.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Hata", description: "Şifreler eşleşmiyor.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsSaving(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Şifre güncellendi", description: "Yeni şifreniz kaydedildi." });
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">E-posta Adresi</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <Badge variant="outline" className="ml-auto">Doğrulanmış</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Şifre</p>
              <p className="text-sm text-muted-foreground">Son güncelleme bilgisi mevcut değil</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(!isChangingPassword)}>
              {isChangingPassword ? "İptal" : "Değiştir"}
            </Button>
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordChange} className="mt-4 pl-[52px] space-y-4">
              <div className="space-y-2">
                <Label>Yeni Şifre</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Şifre Tekrar</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Kaydediliyor..." : "Şifreyi Güncelle"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">İki Faktörlü Doğrulama</p>
              <p className="text-sm text-muted-foreground">Ek güvenlik katmanı için iki faktörlü doğrulamayı etkinleştirin</p>
            </div>
            <Badge variant="secondary" className="ml-auto">Yakında</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
