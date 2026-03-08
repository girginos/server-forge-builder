import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import SEO from "@/components/SEO";

export default function Contact() {
  return (
    <div className="py-12">
      <div className="container max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">İletişim</h1>
        <p className="text-muted-foreground mb-8">Sorularınız ve teklif talepleriniz için bize ulaşın.</p>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border rounded-lg p-6 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">E-posta</p>
                  <p className="text-sm text-muted-foreground">info@servermarket.com.tr</p>
                  <p className="text-sm text-muted-foreground">satis@servermarket.com.tr</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Telefon</p>
                  <p className="text-sm text-muted-foreground">+90 212 555 0000</p>
                  <p className="text-sm text-muted-foreground">+90 532 555 0000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Adres</p>
                  <p className="text-sm text-muted-foreground">Maslak, Büyükdere Cad. No:123 Kat:5, Sarıyer / İstanbul</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Çalışma Saatleri</p>
                  <p className="text-sm text-muted-foreground">Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p className="text-sm text-muted-foreground">Cumartesi: 10:00 - 14:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <form className="bg-card border rounded-lg p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Ad Soyad</label>
                  <Input placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Şirket</label>
                  <Input placeholder="Şirket Adı" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">E-posta</label>
                  <Input type="email" placeholder="ornek@firma.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Telefon</label>
                  <Input type="tel" placeholder="+90 5XX XXX XXXX" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Konu</label>
                <Input placeholder="Konu başlığı" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Mesajınız</label>
                <Textarea placeholder="Mesajınızı yazın..." rows={5} />
              </div>
              <Button variant="hero" size="lg" className="w-full">Gönder</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
