import ServerCard from "@/components/ServerCard";
import serverR740 from "@/assets/server-r740.png";
import serverR640 from "@/assets/server-r640.png";
import serverDL380 from "@/assets/server-dl380.png";
import serverSupermicro from "@/assets/server-supermicro.png";

const allServers = [
  { id: "dell-r740xd", name: "Dell PowerEdge R740xd", image: serverR740, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "3072 GB DDR4", price: 45000, oldPrice: 52000, badge: "Popüler" },
  { id: "dell-r640", name: "Dell PowerEdge R640", image: serverR640, formFactor: "1U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "2048 GB DDR4", price: 32000 },
  { id: "hp-dl380", name: "HP ProLiant DL380 Gen10", image: serverDL380, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "3072 GB DDR4", price: 38000, badge: "Yeni" },
  { id: "supermicro-2u", name: "Supermicro SuperServer 2U", image: serverSupermicro, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "4096 GB DDR4", price: 55000, oldPrice: 62000 },
  { id: "dell-r740xd-12lff", name: "Dell PowerEdge R740xd 12LFF", image: serverR740, formFactor: "2U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "3072 GB DDR4", price: 48000 },
  { id: "hp-dl360", name: "HP ProLiant DL360 Gen10", image: serverDL380, formFactor: "1U Rack Mount", cpu: "2x Intel Xeon Scalable", maxRam: "2048 GB DDR4", price: 35000, badge: "İndirimli", oldPrice: 40000 },
];

export default function Hardware() {
  return (
    <div className="py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Sunucu Donanımları</h1>
          <p className="text-muted-foreground mt-2">Tüm sunucu modellerimizi inceleyin ve ihtiyacınıza uygun olanı seçin.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allServers.map((s) => (
            <ServerCard key={s.id} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}
