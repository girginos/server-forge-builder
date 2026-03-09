import { Link, useLocation } from "react-router-dom";
import { ServerCog, HardDrive, Cpu, MemoryStick, Network, Router, Cable, CircuitBoard, Server } from "lucide-react";

const categories = [
  { label: "Tüm Donanımlar", href: "/hardware", icon: Server },
  { label: "CTO Sunucular", href: "/hardware/cto-sunucular", icon: ServerCog },
  { label: "Disk", href: "/hardware/disk", icon: HardDrive },
  { label: "CPU", href: "/hardware/cpu", icon: Cpu },
  { label: "RAM", href: "/hardware/ram", icon: MemoryStick },
  { label: "Ethernet Kartları", href: "/hardware/ethernet-kartlari", icon: Network },
  { label: "Switch & Router", href: "/hardware/switch-router", icon: Router },
  { label: "Kablo", href: "/hardware/kablo", icon: Cable },
  { label: "Anakart", href: "/hardware/anakart", icon: CircuitBoard },
];

export { categories };

export default function HardwareSidebar() {
  const location = useLocation();

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav className="bg-card border rounded-xl p-2 space-y-0.5 sticky top-20">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-2">
          Kategoriler
        </p>
        {categories.map((cat) => {
          const active = location.pathname === cat.href;
          return (
            <Link
              key={cat.href}
              to={cat.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              <cat.icon className="h-4 w-4 shrink-0" />
              {cat.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
