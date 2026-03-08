import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Server, Eye, EyeOff } from "lucide-react";
import SEO from "@/components/SEO";

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) navigate("/panel", { replace: true });
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <>
      <SEO title="Müşteri Paneli | ServerMarket" description="ServerMarket müşteri paneline giriş yapın veya yeni hesap oluşturun." />
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <Server className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              Müşteri Paneli
            </CardTitle>
            <CardDescription>Hesabınıza giriş yapın veya yeni hesap oluşturun</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      toast({ title: "Giriş başarısız", description: error.message, variant: "destructive" });
    } else {
      navigate("/panel");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "E-posta gönderildi", description: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi." });
      setForgotMode(false);
    }
  };

  if (forgotMode) {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="forgot-email">E-posta</Label>
          <Input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ornek@email.com" />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Gönderiliyor..." : "Şifre Sıfırlama Linki Gönder"}
        </Button>
        <Button type="button" variant="ghost" className="w-full" onClick={() => setForgotMode(false)}>
          Geri Dön
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">E-posta</Label>
        <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ornek@email.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Şifre</Label>
        <div className="relative">
          <Input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
      <button type="button" className="text-sm text-primary hover:underline w-full text-center" onClick={() => setForgotMode(true)}>
        Şifremi unuttum
      </button>
    </form>
  );
}

function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Hata", description: "Şifre en az 6 karakter olmalıdır.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, company },
        emailRedirectTo: window.location.origin,
      },
    });
    setIsLoading(false);
    if (error) {
      toast({ title: "Kayıt başarısız", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Kayıt başarılı!", description: "Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayın." });
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="reg-name">Ad Soyad *</Label>
        <Input id="reg-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Ahmet Yılmaz" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">E-posta *</Label>
        <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ornek@email.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Şifre *</Label>
        <div className="relative">
          <Input id="reg-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="En az 6 karakter" />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-phone">Telefon</Label>
        <Input id="reg-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 5XX XXX XXXX" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-company">Şirket Adı</Label>
        <Input id="reg-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Şirket adınız (opsiyonel)" />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
      </Button>
    </form>
  );
}
