import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Bot, Send, Loader2, ArrowLeft, Sparkles, Server, Database, Globe, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-configurator`;

const quickPrompts = [
  { icon: <Globe className="h-4 w-4" />, label: "Web Hosting", prompt: "Yüksek trafikli bir e-ticaret sitesi barındırmak istiyorum. Günlük 50.000+ ziyaretçi bekliyorum." },
  { icon: <Database className="h-4 w-4" />, label: "Veritabanı", prompt: "Büyük bir veritabanı sunucusuna ihtiyacım var. PostgreSQL üzerinde 500GB+ veri tutacağım." },
  { icon: <Cpu className="h-4 w-4" />, label: "Sanallaştırma", prompt: "VMware ESXi ile sanallaştırma ortamı kurmak istiyorum. Yaklaşık 20 sanal makine çalıştıracağım." },
  { icon: <Server className="h-4 w-4" />, label: "AI / ML", prompt: "Makine öğrenmesi ve AI modelleri eğitmek istiyorum. GPU destekli yüksek hesaplama gücüne ihtiyacım var." },
];

export default function AIConfigurator() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setResponse("");
    setHasResult(true);
    setInput("");

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Bağlantı hatası" }));
        setResponse(`❌ ${err.error || "Bir hata oluştu."}`);
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setResponse(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      setResponse("❌ Bağlantı hatası. Lütfen tekrar deneyin.");
    }

    setIsLoading(false);
  };

  return (
    <div className="py-8 min-h-[80vh]">
      <SEO
        title="AI Sunucu Danışmanı"
        description="Yapay zeka destekli sunucu yapılandırma danışmanı. İhtiyacınızı anlatın, size en uygun sunucuyu önerelim."
        canonical="/yapilandirici/ai"
      />
      <div className="container max-w-4xl">
        <div className="mb-6">
          <Link to="/yapilandirici" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> Yapılandırıcıya Dön
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Sunucu Danışmanı</h1>
              <p className="text-sm text-muted-foreground">İhtiyacınızı anlatın, size en uygun yapılandırmayı önerelim</p>
            </div>
          </div>
        </div>

        {!hasResult && (
          <div className="space-y-6">
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-10 w-10 mx-auto mb-3 text-primary/60" />
                <h3 className="font-semibold text-foreground mb-1">Nasıl çalışır?</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Kullanım amacınızı, beklediğiniz trafik/yükü ve bütçenizi yazın.
                  AI danışmanımız size en uygun sunucu yapılandırmasını önersin.
                </p>
              </CardContent>
            </Card>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Hızlı başlangıç:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickPrompts.map((qp) => (
                  <button
                    key={qp.label}
                    onClick={() => { setInput(qp.prompt); handleSubmit(qp.prompt); }}
                    className="flex items-center gap-3 bg-card border rounded-xl px-4 py-3.5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {qp.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{qp.label}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{qp.prompt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {hasResult && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="gap-1">
                  <Bot className="h-3 w-3" /> AI Önerisi
                </Badge>
                {isLoading && (
                  <Badge variant="secondary" className="gap-1 animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" /> Analiz ediliyor...
                  </Badge>
                )}
              </div>
              <div ref={responseRef} className="prose prose-sm dark:prose-invert max-w-none max-h-[55vh] overflow-y-auto">
                <ReactMarkdown>{response || "..."}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input area */}
        <div className="sticky bottom-4 bg-card border rounded-2xl p-3 shadow-lg">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(input);
                }
              }}
              placeholder="Kullanım amacınızı ve ihtiyaçlarınızı yazın... (ör: E-ticaret sitesi için sunucu arıyorum)"
              rows={2}
              className="min-h-[48px] max-h-[120px] resize-none border-0 focus-visible:ring-0 shadow-none"
            />
            <Button
              onClick={() => handleSubmit(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0 h-10 w-10 rounded-xl"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
