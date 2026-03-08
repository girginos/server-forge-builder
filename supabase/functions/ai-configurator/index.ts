import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Sen bir kurumsal sunucu uzmanısın. Kullanıcının ihtiyacına göre sunucu yapılandırması öneriyorsun.

Kullanıcı sana kullanım amacını ve beklentilerini anlatacak. Sen de ona uygun bir sunucu yapılandırması önereceksin.

Yanıtında şu başlıkları kullan ve her birini açıkla:
- **Önerilen Sunucu Modeli**: (Dell R740xd, Dell R640, HP DL380 Gen10 veya Supermicro 2U)
- **İşlemci (CPU)**: Seçilen işlemci ve neden uygun olduğu
- **Bellek (RAM)**: Önerilen RAM miktarı ve gerekçesi
- **Depolama**: Disk tipi ve kapasitesi
- **RAID Yapılandırması**: Önerilen RAID kartı
- **Ağ Kartı**: Bant genişliği ihtiyacına göre önerilen ağ kartı
- **Güç Kaynağı**: Önerilen PSU
- **Tahmini Fiyat Aralığı**: Yaklaşık TL fiyat aralığı (₺25.000 - ₺150.000 arasında)

Sonunda kısa bir özet paragraf ekle ve neden bu yapılandırmayı önerdiğini açıkla.
Yanıtın Türkçe olsun. Profesyonel ama anlaşılır bir dil kullan.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Çok fazla istek gönderildi, lütfen biraz bekleyin." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI servisi için kredi yetersiz." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI servisi şu anda kullanılamıyor." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-configurator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Bilinmeyen hata" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
