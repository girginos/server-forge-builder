export const HARDWARE_CATEGORIES = [
  { value: "server", label: "Sunucu (Komple)", slug: "server" },
  { value: "cto-sunucular", label: "CTO Sunucular", slug: "cto-sunucular" },
  { value: "disk", label: "Disk & Depolama", slug: "disk" },
  { value: "cpu", label: "CPU - İşlemci", slug: "cpu" },
  { value: "ram", label: "RAM - Bellek", slug: "ram" },
  { value: "ethernet", label: "Ethernet Kartları", slug: "ethernet-kartlari" },
  { value: "switch-router", label: "Switch & Router", slug: "switch-router" },
  { value: "kablo", label: "Kablo & Bağlantı", slug: "kablo" },
  { value: "anakart", label: "Anakart", slug: "anakart" },
] as const;

export type HardwareCategory = typeof HARDWARE_CATEGORIES[number]["value"];

export function getCategoryLabel(value: string): string {
  return HARDWARE_CATEGORIES.find((c) => c.value === value)?.label || value;
}
