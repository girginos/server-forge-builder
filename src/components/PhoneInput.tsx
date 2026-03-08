import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const COUNTRIES = [
  { code: "+90", flag: "🇹🇷", name: "Türkiye" },
  { code: "+1", flag: "🇺🇸", name: "ABD" },
  { code: "+44", flag: "🇬🇧", name: "İngiltere" },
  { code: "+49", flag: "🇩🇪", name: "Almanya" },
  { code: "+33", flag: "🇫🇷", name: "Fransa" },
  { code: "+31", flag: "🇳🇱", name: "Hollanda" },
  { code: "+39", flag: "🇮🇹", name: "İtalya" },
  { code: "+34", flag: "🇪🇸", name: "İspanya" },
  { code: "+7", flag: "🇷🇺", name: "Rusya" },
  { code: "+86", flag: "🇨🇳", name: "Çin" },
  { code: "+81", flag: "🇯🇵", name: "Japonya" },
  { code: "+82", flag: "🇰🇷", name: "G. Kore" },
  { code: "+91", flag: "🇮🇳", name: "Hindistan" },
  { code: "+971", flag: "🇦🇪", name: "BAE" },
  { code: "+966", flag: "🇸🇦", name: "S. Arabistan" },
  { code: "+994", flag: "🇦🇿", name: "Azerbaycan" },
  { code: "+995", flag: "🇬🇪", name: "Gürcistan" },
  { code: "+380", flag: "🇺🇦", name: "Ukrayna" },
  { code: "+30", flag: "🇬🇷", name: "Yunanistan" },
  { code: "+359", flag: "🇧🇬", name: "Bulgaristan" },
];

interface PhoneInputProps {
  value: string; // full value like "+90 5XX..."
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

function parsePhone(val: string): { code: string; number: string } {
  // Try to match a known country code at the start
  const trimmed = val.replace(/^\s+/, "");
  for (const c of [...COUNTRIES].sort((a, b) => b.code.length - a.code.length)) {
    if (trimmed.startsWith(c.code)) {
      return { code: c.code, number: trimmed.slice(c.code.length).trim() };
    }
  }
  return { code: "+90", number: trimmed.replace(/^\+?\d{1,3}\s*/, "") };
}

export default function PhoneInput({ value, onChange, error, className }: PhoneInputProps) {
  const parsed = parsePhone(value);
  const [countryCode, setCountryCode] = useState(parsed.code);
  const [number, setNumber] = useState(parsed.number);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = parsePhone(value);
    setCountryCode(p.code);
    setNumber(p.number);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const emitChange = (code: string, num: string) => {
    onChange(`${code} ${num}`.trim());
  };

  const country = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
  const filtered = search
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search))
    : COUNTRIES;

  return (
    <div className={className}>
      <div className="flex gap-0">
        {/* Country selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => { setOpen(!open); setSearch(""); }}
            className={cn(
              "flex items-center gap-1 h-10 px-2.5 border border-r-0 rounded-l-md bg-muted/50 text-sm font-medium text-foreground hover:bg-muted transition-colors",
              "min-w-[85px] justify-between",
              open && "ring-2 ring-ring"
            )}
          >
            <span className="text-base leading-none">{country.flag}</span>
            <span className="text-xs">{countryCode}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>

          {open && (
            <div className="absolute z-50 top-full left-0 mt-1 w-56 bg-popover border rounded-md shadow-lg overflow-hidden">
              <div className="p-1.5">
                <input
                  type="text"
                  placeholder="Ülke ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded border bg-background text-foreground outline-none focus:ring-1 ring-ring"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-auto">
                {filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCountryCode(c.code);
                      emitChange(c.code, number);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-accent transition-colors text-left",
                      c.code === countryCode && "bg-accent/60 font-medium"
                    )}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span className="flex-1 text-foreground">{c.name}</span>
                    <span className="text-muted-foreground text-xs">{c.code}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">Sonuç bulunamadı</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone number */}
        <Input
          type="tel"
          value={number}
          onChange={(e) => {
            const v = e.target.value;
            setNumber(v);
            emitChange(countryCode, v);
          }}
          placeholder="5XX XXX XXXX"
          className="rounded-l-none flex-1"
        />
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
