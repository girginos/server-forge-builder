import { Users, Award, Globe, TrendingUp } from "lucide-react";
import SEO from "@/components/SEO";

const stats = [
  { icon: Users, value: "500+", label: "Mutlu Müşteri" },
  { icon: Award, value: "15+", label: "Yıllık Deneyim" },
  { icon: Globe, value: "3", label: "Veri Merkezi" },
  { icon: TrendingUp, value: "10.000+", label: "Satılan Sunucu" },
];

export default function About() {
  return (
    <div>
      <section className="gradient-hero text-secondary-foreground py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold">Hakkımızda</h1>
          <p className="text-secondary-foreground/70 mt-3 max-w-2xl mx-auto">
            ServerMarket olarak 15 yılı aşkın süredir Türkiye'nin önde gelen kurumsal sunucu çözümleri sağlayıcısıyız.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {stats.map((s) => (
              <div key={s.label} className="bg-card border rounded-lg p-6 text-center shadow-card">
                <s.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <h2 className="text-2xl font-bold">Misyonumuz</h2>
            <p className="text-muted-foreground">
              İşletmelere en yüksek kalitede sunucu donanımları ve altyapı hizmetleri sunarak dijital dönüşüm süreçlerinde güvenilir bir iş ortağı olmak. Her ölçekten işletmenin enterprise sınıfı teknolojiye erişebilmesini sağlamak temel hedefimizdir.
            </p>

            <h2 className="text-2xl font-bold">Neden ServerMarket?</h2>
            <p className="text-muted-foreground">
              Alanında uzman teknik ekibimiz, geniş ürün portföyümüz ve müşteri odaklı hizmet anlayışımızla sektörde fark yaratıyoruz. Tüm sunucularımız kapsamlı testlerden geçirilerek teslim edilir ve 1 yıl garanti kapsamında satışa sunulur.
            </p>

            <h2 className="text-2xl font-bold">Kalite Güvencesi</h2>
            <p className="text-muted-foreground">
              Her sunucu, 72 saatlik yoğun stres testinden geçirilir. Bellek, disk, CPU ve ağ bileşenleri tek tek kontrol edilir. Müşterilerimize yalnızca en yüksek kalite standartlarını karşılayan ürünleri teslim ederiz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
