import { Link } from "react-router-dom";
import { Server, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="gradient-navy text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Server className="h-6 w-6 text-teal" />
              <span>Server<span className="text-teal">Market</span></span>
            </Link>
            <p className="text-sm text-secondary-foreground/70">
              Kurumsal sunucu çözümleri ve donanım satışında Türkiye'nin güvenilir adresi.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-teal">Ürünler</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/hardware" className="hover:text-teal transition-colors">Sunucu Donanımları</Link></li>
              <li><Link to="/yapilandirici" className="hover:text-teal transition-colors">Sunucu Yapılandırıcı</Link></li>
              <li><Link to="/cloud" className="hover:text-teal transition-colors">Cloud Çözümleri</Link></li>
              <li><Link to="/leasing" className="hover:text-teal transition-colors">Kirala Senin Olsun</Link></li>
              <li><Link to="/colocation" className="hover:text-teal transition-colors">Colocation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-teal">Kurumsal</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/hakkimizda" className="hover:text-teal transition-colors">Hakkımızda</Link></li>
              <li><Link to="/iletisim" className="hover:text-teal transition-colors">İletişim</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-teal">İletişim</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-teal" /> info@servermarket.com.tr</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-teal" /> +90 212 555 0000</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-teal mt-0.5" /> Maslak, Büyükdere Cad. İstanbul</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary/20 mt-8 pt-6 text-center text-xs text-secondary-foreground/50">
          © 2026 ServerMarket. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
