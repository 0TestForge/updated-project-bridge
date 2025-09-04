import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGeo } from "@/hooks/useGeo";
import { CheckoutDialog } from "@/components/CheckoutDialog";

// Domain types
type Item = {
  id: string;
  name: string;
  image: string;
  category: "pet" | "plant";
  stock: number;
  priceUSD: number;
};

type FilterKey = "all" | "pets" | "plants";

type CartLine = { id: string; qty: number; item: Item };

// Catalog (Murder Mystery 2)
export const ITEMS: Item[] = [
  { id: "chroma-blade", name: "Chroma Blade", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F205ad800b7024ca2b7155e38798bae3b?format=webp&width=800", category: "pet", stock: 5, priceUSD: 15 },
  { id: "tree-knife", name: "Tree Knife", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F6423c1dd754049b1a5cffcc85838ee79?format=webp&width=800", category: "pet", stock: 4, priceUSD: 12 },
  { id: "spiked-bat", name: "Spiked Bat", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fdfae1ac3507e4cb4a594ffa1807de385?format=webp&width=800", category: "pet", stock: 6, priceUSD: 10 },
  { id: "tree-gun", name: "Tree Gun", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F5e22f58e53294ed6a26f2c6ab50df3d6?format=webp&width=800", category: "pet", stock: 3, priceUSD: 14 },
  { id: "candy-cane", name: "Candy Cane", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Ff134024984cb4ad698648a754fd0a2be?format=webp&width=800", category: "plant", stock: 7, priceUSD: 9 },
  { id: "amethyst-shard", name: "Amethyst Shard", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F496984993eb143918635d20040f77302?format=webp&width=800", category: "plant", stock: 2, priceUSD: 20 },
  { id: "batwing-scythe", name: "Batwing Scythe", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F29e30af1b2cc4e5595d15c28ed76d848?format=webp&width=800", category: "plant", stock: 2, priceUSD: 25 },
  { id: "chroma-luger", name: "Chroma Luger", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F12b3665e7d564c778d3163afd561a555?format=webp&width=800", category: "plant", stock: 5, priceUSD: 22 },
];

export default function MM2() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState("");
  const [currencyOverride, setCurrencyOverride] = useState<string | null>(null);
  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const geo = useGeo();
  const [rate, setRate] = useState<number>(1);
  const prevY = useRef(0);
  useEffect(() => { const onScroll = () => { prevY.current = window.scrollY; }; window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const saved = localStorage.getItem("currencyOverride"); if (saved) setCurrencyOverride(saved); const handler = (e: Event) => { const detail = (e as CustomEvent<string>).detail; setCurrencyOverride(detail); localStorage.setItem("currencyOverride", detail); }; window.addEventListener("currency:override", handler as EventListener); return () => window.removeEventListener("currency:override", handler as EventListener); }, []);
  const currency = currencyOverride || geo.currency || "USD";
  useEffect(() => { let mounted = true; const loadRate = async () => { try { if (currency === "USD") { setRate(1); return; } let r = 1; try { const res = await fetch(`/api/rates?base=USD&symbols=${encodeURIComponent(currency)}`); if (res.ok) { const data = await res.json(); r = Number(data?.rate) || 1; } } catch {} if (mounted) setRate(r); } catch { if (mounted) setRate(1); } }; loadRate(); setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0); return () => { mounted = false; }; }, [currency]);
  useEffect(() => { setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0); }, [rate]);
  const priceFmt = useMemo(() => new Intl.NumberFormat(undefined, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }), [currency]);
  const toLocal = (usd: number) => usd * rate;
  const toLocalRounded = (usd: number) => Math.round(toLocal(usd));
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  useEffect(() => { try { const raw = localStorage.getItem("priceOverrides"); if (raw) setOverrides(JSON.parse(raw) || {}); } catch {} const onPrices = () => { try { const raw = localStorage.getItem("priceOverrides"); setOverrides(raw ? JSON.parse(raw) : {}); } catch {} }; window.addEventListener("prices:update", onPrices as EventListener); window.addEventListener("storage", onPrices as EventListener); return () => { window.removeEventListener("prices:update", onPrices as EventListener); window.removeEventListener("storage", onPrices as EventListener); }; }, []);
  const itemsCurrent: Item[] = useMemo(() => ITEMS.map(i => ({ ...i, priceUSD: overrides[i.id] ?? i.priceUSD })), [overrides]);
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});
  useEffect(() => { try { const raw = localStorage.getItem("stockOverrides"); if (raw) setStockOverrides(JSON.parse(raw) || {}); } catch {} const onStock = () => { try { const raw = localStorage.getItem("stockOverrides"); setStockOverrides(raw ? JSON.parse(raw) : {}); } catch {} }; window.addEventListener("stock:update", onStock as EventListener); window.addEventListener("storage", onStock as EventListener); return () => { window.removeEventListener("stock:update", onStock as EventListener); window.removeEventListener("storage", onStock as EventListener); }; }, []);
  const groupedCart: CartLine[] = useMemo(() => { const map = new Map<string, CartLine>(); for (const it of cart) { const g = map.get(it.id); if (g) g.qty += 1; else map.set(it.id, { id: it.id, qty: 1, item: it }); } return Array.from(map.values()); }, [cart]);
  const totalUSD = groupedCart.reduce((s, l) => s + (overrides[l.id] ?? l.item.priceUSD) * l.qty, 0);
  const totalLocalRounded = Math.round(toLocal(totalUSD));
  const filtered = useMemo(() => { const byFilter = itemsCurrent.filter((i) => (filter === "plants" ? i.category === "plant" : filter === "pets" ? i.category === "pet" : true)); const query = q.trim().toLowerCase(); return query ? byFilter.filter((i) => i.name.toLowerCase().includes(query)) : byFilter; }, [filter, q, itemsCurrent]);
  const qtyInCart = (id: string) => groupedCart.find((l) => l.id === id)?.qty || 0;
  const addToCart = (item: Item) => { const qty = qtyInCart(item.id); const effStock = stockOverrides[item.id] ?? item.stock; if (qty >= effStock) { toast({ title: "Max stock reached", description: `${item.name} stock: ${effStock}` }); return; } setCart((c) => [...c, item]); setShowHint(true); setShowBubble(true); setTimeout(() => setShowBubble(false), 4000); toast({ title: "Added to cart", description: `${item.name} • ${priceFmt.format(toLocalRounded(item.priceUSD))}` }); };
  const removeOne = (id: string) => { setCart((c) => { const idx = c.findIndex((x) => x.id === id); if (idx === -1) return c; const next = c.slice(); next.splice(idx, 1); return next; }); };
  const removeAll = (id: string) => { setCart((c) => c.filter((x) => x.id !== id)); };
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900 via-emerald-950 to-black" />
        <div className="container py-10 md:py-14">
          <div className="flex items-center justify-between">
            <span className="inline-block rounded-lg bg-emerald-900/70 px-3 py-1.5 text-sm font-bold uppercase tracking-widest text-emerald-100 ring-1 ring-emerald-700/40">Murder Mystery 2</span>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="default" size="sm" onClick={() => setFilter("all")}>All</Button>
            </div>
            <div className="w-full md:w-80">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="bg-emerald-950/40 border-emerald-800/50" />
            </div>
          </div>

          {showHint && (
            <div className="mt-4 rounded-lg border border-emerald-700/40 bg-emerald-900/40 p-3 text-sm text-emerald-100 flex items-center justify-between">
              <span>Item added. Check your cart to proceed to checkout.</span>
              <Button size="sm" onClick={() => setCartOpen(true)}>Open Cart</Button>
            </div>
          )}

          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((it, idx) => {
                const qty = qtyInCart(it.id);
                const effStock = stockOverrides[it.id] ?? it.stock;
                const soldOut = qty >= effStock;
                return (
                  <div key={it.id} className="group relative overflow-hidden rounded-2xl border border-emerald-700/30 bg-emerald-900/20 p-3 transition-transform duration-500 ease-out hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-0.5 hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: `${(idx % 12) * 40}ms` }}>
                    <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-emerald-700/20 group-hover:ring-emerald-500/30 transition">
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover transition duration-500 ease-out group-hover:brightness-110" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-70">
                        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_20%,rgba(110,231,183,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(52,211,153,0.3),transparent_40%)]" />
                      </div>
                      <div className="absolute right-2 top-2 rounded-md bg-[#050B1F]/80 px-2 py-1 text-xs text-blue-100 ring-1 ring-blue-900/60">Stock: {Math.max(0, (stockOverrides[it.id] ?? it.stock) - qty)}</div>
                      <div className="absolute inset-x-2 bottom-2 translate-y-8 opacity-0 will-change-transform transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                        <Button disabled={soldOut} onClick={() => addToCart(it)} className="w-full h-9 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-60">{soldOut ? "Sold Out" : "Add to Cart"}</Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{it.name}</h3>
                        <span className="rounded-md bg-emerald-900/60 px-2 py-0.5 text-[11px] ring-1 ring-emerald-700/40">{priceFmt.format(toLocalRounded(it.priceUSD))}</span>
                      </div>
                      <p className="mt-1 text-xs text-emerald-200/80">Limited • Instant delivery</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showBubble && !cartOpen && (
          <div className="fixed bottom-20 right-6 z-50 rounded-md border border-emerald-400/30 bg-emerald-950 px-3 py-2 text-xs text-emerald-100 shadow-lg animate-in fade-in-0 slide-in-from-bottom-2">
            Click to open cart
            <div className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-b border-r border-emerald-400/30 bg-emerald-950" />
          </div>
        )}

        <Popover open={cartOpen} onOpenChange={setCartOpen}>
          <PopoverTrigger asChild>
            <Button className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-xl shadow-emerald-900/20 bg-[#081433] hover:bg-[#0A1F4D] ring-1 ring-emerald-800/40 p-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="20" r="1" fill="currentColor"/>
                <circle cx="18" cy="20" r="1" fill="currentColor"/>
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 w-5 place-content-center rounded-full bg-white text-[11px] font-bold text-emerald-700 ring-2 ring-emerald-600">{cart.length}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Cart</h4>
              {groupedCart.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                  {groupedCart.map((l) => (
                    <li key="l.id" className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={l.item.image} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{l.item.name} × {l.qty}</p>
                          <p className="text-xs text-muted-foreground">{priceFmt.format(Math.round(toLocal((overrides[l.id] ?? l.item.priceUSD) * l.qty)))}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeOne(l.id)}>−</Button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-sm font-semibold">{priceFmt.format(totalLocalRounded)}</span>
              </div>
              <Button disabled={groupedCart.length === 0} onClick={() => { if (groupedCart.length === 0) return; setCartOpen(false); setCheckoutOpen(true); }} className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-60">Go to Checkout</Button>
            </div>
          </PopoverContent>
        </Popover>
        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          currency={currency}
          lines={groupedCart.map((l) => ({ id: l.id, name: l.item.name, qty: l.qty, priceLocal: Math.round(toLocal(l.item.priceUSD * l.qty)), thumb: l.item.image }))}
          totalLocal={totalLocalRounded}
          onRemoveOne={removeOne}
          onRemoveAll={removeAll}
        />
      </section>
    </div>
  );
}