import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { SelectGameDialog } from "@/components/SelectGameDialog";
import { useGeo } from "@/hooks/useGeo";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [curSearch, setCurSearch] = useState("");
  const geo = useGeo();
  const override = typeof window !== "undefined" ? localStorage.getItem("currencyOverride") : null;
  const activeCurrency = override || geo.currency || "USD";

  const list = useMemo(
    () => [
      "USD","EUR","GBP","GEL","TRY","INR","JPY","CNY","AUD","CAD","BRL","CHF","RUB","PLN","SEK","NOK","DKK","HUF","CZK","AED","SAR","ZAR","MXN"
    ].filter((c) => c.toLowerCase().includes(curSearch.toLowerCase())),
    [curSearch],
  );

  const setCurrency = (code: string) => {
    localStorage.setItem("currencyOverride", code);
    window.dispatchEvent(new CustomEvent("currency:override", { detail: code }));
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/70 border-b border-white/5">
      <div className="container flex h-16 items-center gap-3">
        <a href="/" className="flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F59703aedd2134312974c10a72e7d28f4?format=webp&width=220"
            alt="RO-CART logo"
            className="h-8 md:h-9 w-auto object-contain"
          />
          <span className="sr-only">RO-CART</span>
        </a>

        <div className="ml-auto flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <a href="#features" className="px-3 py-2 rounded-md hover:bg-white/5 transition">Features</a>
            <a href="#how" className="px-3 py-2 rounded-md hover:bg-white/5 transition">How it works</a>
            <a href="#faq" className="px-3 py-2 rounded-md hover:bg-white/5 transition">FAQ</a>
          </nav>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="hidden sm:inline-flex">Currency · {activeCurrency}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <Input autoFocus placeholder="Search currency..." value={curSearch} onChange={(e) => setCurSearch(e.target.value)} />
                <div className="grid max-h-64 gap-1 overflow-auto pr-1" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                  {list.map((c) => (
                    <Button key={c} size="sm" variant={c === activeCurrency ? "default" : "secondary"} onClick={() => setCurrency(c)}>
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <SelectGameDialog>
            <Button variant="ghost" className="hidden sm:inline-flex">Select Game</Button>
          </SelectGameDialog>
          <SelectGameDialog>
            <Button className={cn("bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25")}>Shop Now</Button>
          </SelectGameDialog>
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-background/80 backdrop-blur">
          <div className="container py-3 grid gap-2">
            <div className="text-xs text-muted-foreground">Currency · {activeCurrency} {geo.country ? `· ${geo.country}` : ""}</div>
            <a href="#features" className="px-3 py-2 rounded-md hover:bg-white/5 transition">Features</a>
            <a href="#how" className="px-3 py-2 rounded-md hover:bg-white/5 transition">How it works</a>
            <a href="#faq" className="px-3 py-2 rounded-md hover:bg-white/5 transition">FAQ</a>
            <SelectGameDialog>
              <button className="px-3 py-2 text-left rounded-md hover:bg-white/5 transition">Select Game</button>
            </SelectGameDialog>
          </div>
        </div>
      )}
    </header>
  );
}
