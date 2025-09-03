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

// Catalog
const ITEMS: Item[] = [
  // Pets
  { id: "red-bee", name: "Red Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F40acc6f230a14be08df9c83c5a4cd86b?format=webp&width=800", category: "pet", stock: 2, priceUSD: 12 },
  { id: "duck-rider", name: "Duck Rider", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fe0a787ae09e544ad86c9e7539ba74673?format=webp&width=800", category: "pet", stock: 5, priceUSD: 10 },
  { id: "queen-bee", name: "Queen Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F831fc4b380f74e84807494f864231c10?format=webp&width=800", category: "pet", stock: 3, priceUSD: 20 },
  { id: "wasp", name: "Neon Wasp", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F68399c1d84594269b8f08b17a00b1cfe?format=webp&width=800", category: "pet", stock: 4, priceUSD: 8 },
  { id: "shiba", name: "Shiba", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F51c35bbfa0e048d7afd6486443420b28?format=webp&width=800", category: "pet", stock: 7, priceUSD: 15 },
  { id: "octo", name: "Octo", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fe36ba05f95ec473bb9a3f3c57a5b9c5a?format=webp&width=800", category: "pet", stock: 2, priceUSD: 25 },
  { id: "phoenix", name: "Phoenix", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F9a6dd0d8e0c045c5aed3027e21a03d42?format=webp&width=800", category: "pet", stock: 1, priceUSD: 30 },
  { id: "rainbow-bee", name: "Rainbow Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fbb714220133840b29940ad0dccecbcdd?format=webp&width=800", category: "pet", stock: 3, priceUSD: 18 },
  { id: "rainbow-wasp", name: "Rainbow Wasp", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F91504519181b4952af7ec765f387df90?format=webp&width=800", category: "pet", stock: 2, priceUSD: 19 },
  { id: "gold-wasp", name: "Gold Wasp", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fff742625b1a243cfa235fdb3907709a7?format=webp&width=800", category: "pet", stock: 1, priceUSD: 40 },
  { id: "rainbow-queen", name: "Rainbow Queen Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F2d1eaecfc0244aa5a8868c12666ab96b?format=webp&width=800", category: "pet", stock: 1, priceUSD: 45 },
  { id: "orange-queen", name: "Orange Queen Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F01330ed5e86942bca9fa7baeffce32c4?format=webp&width=800", category: "pet", stock: 2, priceUSD: 28 },
  { id: "pink-bee", name: "Pink Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F78eb5b34035f45c8955032974100aa81?format=webp&width=800", category: "pet", stock: 4, priceUSD: 14 },
  { id: "dino", name: "Dino", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F39e5c800109f4927aee8f94d892c985c?format=webp&width=800", category: "pet", stock: 2, priceUSD: 22 },
  { id: "masked-dog", name: "Masked Dog", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F1b31d21ebe104f6ab0e12819d6415b9a?format=webp&width=800", category: "pet", stock: 6, priceUSD: 13 },
  { id: "rainbow-dog", name: "Rainbow Dog", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F94bd90a7d545485c9c48ce81ff1c70a5?format=webp&width=800", category: "pet", stock: 3, priceUSD: 21 },
  { id: "griffin", name: "Griffin", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F3a8f470936c44599b6a1abb84450d540?format=webp&width=800", category: "pet", stock: 1, priceUSD: 55 },
  { id: "wyrm", name: "Wyrm", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F0107e74ca582478bba915fdfd7926563?format=webp&width=800", category: "pet", stock: 1, priceUSD: 38 },
  // Plants
  { id: "sprout-pack", name: "Purple Sprout Pack", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fbe60cc732b1b44f28e3af656696011b5?format=webp&width=800", category: "plant", stock: 8, priceUSD: 9 },
  { id: "sprout-single", name: "Purple Sprout", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F68f58bd0f45b49ba8cb0aa48accb095b?format=webp&width=800", category: "plant", stock: 20, priceUSD: 3 },
  { id: "sprout-trio", name: "Sprout Trio", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fb468b81480d949fba738072a39790a00?format=webp&width=800", category: "plant", stock: 10, priceUSD: 6 },
  { id: "sheckles-8qd", name: "8QD Sheckles", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Faf8dccb5646b4daa91e9036be29a7e2a?format=webp&width=800", category: "plant", stock: 5, priceUSD: 12 },
  { id: "sheckles-744t", name: "744T Sheckles", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fd8fdd0b63ad242cabb2077fe8a1612e9?format=webp&width=800", category: "plant", stock: 5, priceUSD: 14 },
  { id: "sheckles-8qd-single", name: "8QD Sheckles Single", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F4a894719237a4270879984e87ef2d897?format=webp&width=800", category: "plant", stock: 12, priceUSD: 4 },
];

export default function GrowGarden() {
  // Filters and search
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState("");

  // Currency override from header
  const [currencyOverride, setCurrencyOverride] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  // Geo + currency conversion
  const geo = useGeo();
  const [rate, setRate] = useState<number>(1);

  // Prevent scroll jump when currency/rate resolves
  const prevY = useRef(0);
  useEffect(() => {
    const onScroll = () => { prevY.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Listen to currency override from header
  useEffect(() => {
    const saved = localStorage.getItem("currencyOverride");
    if (saved) setCurrencyOverride(saved);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setCurrencyOverride(detail);
      localStorage.setItem("currencyOverride", detail);
    };
    window.addEventListener("currency:override", handler as EventListener);
    return () => window.removeEventListener("currency:override", handler as EventListener);
  }, []);

  const currency = currencyOverride || geo.currency || "USD";

  useEffect(() => {
    let mounted = true;
    const loadRate = async () => {
      try {
        if (currency === "USD") { setRate(1); return; }
        // Call our server proxy to avoid CORS and blockers
        let r = 1;
        try {
          const res = await fetch(`/api/rates?base=USD&symbols=${encodeURIComponent(currency)}`);
          if (res.ok) {
            const data = await res.json();
            r = Number(data?.rate) || 1;
          }
        } catch {}
        if (mounted) setRate(r);
      } catch { if (mounted) setRate(1); }
    };
    loadRate();
    // restore scroll
    setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0);
    return () => { mounted = false; };
  }, [currency]);
  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0);
  }, [rate]);

  const priceFmt = useMemo(
    () => new Intl.NumberFormat(undefined, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    [currency],
  );
  const toLocal = (usd: number) => usd * rate;
  const toLocalRounded = (usd: number) => Math.round(toLocal(usd));

  const groupedCart: CartLine[] = useMemo(() => {
    const map = new Map<string, CartLine>();
    for (const it of cart) {
      const g = map.get(it.id);
      if (g) g.qty += 1; else map.set(it.id, { id: it.id, qty: 1, item: it });
    }
    return Array.from(map.values());
  }, [cart]);

  const totalUSD = groupedCart.reduce((s, l) => s + l.item.priceUSD * l.qty, 0);
  const totalLocalRounded = Math.round(toLocal(totalUSD));

  const filtered = useMemo(() => {
    const byFilter = ITEMS.filter((i) => (filter === "plants" ? i.category === "plant" : filter === "pets" ? i.category === "pet" : true));
    const query = q.trim().toLowerCase();
    return query ? byFilter.filter((i) => i.name.toLowerCase().includes(query)) : byFilter;
  }, [filter, q]);

  const qtyInCart = (id: string) => groupedCart.find((l) => l.id === id)?.qty || 0;

  const addToCart = (item: Item) => {
    const qty = qtyInCart(item.id);
    if (qty >= item.stock) { toast({ title: "Max stock reached", description: `${item.name} stock: ${item.stock}` }); return; }
    setCart((c) => [...c, item]);
    setShowHint(true);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 4000);
    toast({ title: "Added to cart", description: `${item.name} • ${priceFmt.format(toLocalRounded(item.priceUSD))}` });
  };

  const removeOne = (id: string) => {
    setCart((c) => {
      const idx = c.findIndex((x) => x.id === id);
      if (idx === -1) return c;
      const next = c.slice();
      next.splice(idx, 1);
      return next;
    });
  };

  const removeAll = (id: string) => {
    setCart((c) => c.filter((x) => x.id !== id));
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900 via-emerald-950 to-black" />
        <div className="container py-10 md:py-14">
          {/* Top banner */}
          <div className="relative h-40 md:h-56 overflow-hidden rounded-2xl border border-emerald-700/30">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F9793911789cb412182d65fd16d14b29b?format=webp&width=1200" alt="Grow a Garden banner" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
            <div className="absolute left-4 bottom-4">
              <span className="inline-block rounded-lg bg-emerald-900/70 px-3 py-1.5 text-sm font-bold uppercase tracking-widest text-emerald-100 ring-1 ring-emerald-700/40">Grow a Garden</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant={filter === "all" ? "default" : "secondary"} size="sm" onClick={() => setFilter("all")}>All</Button>
              <Button variant={filter === "pets" ? "default" : "secondary"} size="sm" onClick={() => setFilter("pets")}>Pets</Button>
              <Button variant={filter === "plants" ? "default" : "secondary"} size="sm" onClick={() => setFilter("plants")}>Plants</Button>
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
                const soldOut = qty >= it.stock;
                return (
                  <div key={it.id} className="group relative overflow-hidden rounded-2xl border border-emerald-700/30 bg-emerald-900/20 p-3 transition-transform duration-500 ease-out hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-0.5 hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: `${(idx % 12) * 40}ms` }}>
                    <div className="relative aspect-square overflow-hidden rounded-xl">
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute left-2 top-2 rounded-md bg-emerald-900/70 px-2 py-1 text-xs ring-1 ring-emerald-700/40">{priceFmt.format(toLocalRounded(it.priceUSD))}</div>
                      <div className="absolute right-2 top-2 rounded-md bg-black/40 px-2 py-1 text-xs">Stock: {it.stock - qty}</div>
                      <div className="absolute inset-x-2 bottom-2 translate-y-8 opacity-0 will-change-transform transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                        <Button disabled={soldOut} onClick={() => addToCart(it)} className="w-full h-9 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60">{soldOut ? "Sold Out" : "Add to Cart"}</Button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{it.name}</h3>
                        <p className="text-xs text-emerald-200/80">Limited • Instant delivery</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Cart (page only) with bubble */}
        {showBubble && !cartOpen && (
          <div className="fixed bottom-20 right-6 z-50 rounded-md border border-indigo-400/30 bg-indigo-950 px-3 py-2 text-xs text-indigo-100 shadow-lg animate-in fade-in-0 slide-in-from-bottom-2">
            Click to open cart
            <div className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-b border-r border-indigo-400/30 bg-indigo-950" />
          </div>
        )}

        <Popover open={cartOpen} onOpenChange={setCartOpen}>
          <PopoverTrigger asChild>
            <Button className="fixed bottom-4 right-4 z-50 rounded-full h-12 px-5 shadow-xl shadow-indigo-900/30 bg-gradient-to-r from-indigo-800 to-blue-700 hover:from-indigo-900 hover:to-blue-800">Cart ({cart.length}) • {priceFmt.format(totalLocalRounded)}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Cart</h4>
              {groupedCart.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                  {groupedCart.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{l.item.name} × {l.qty}</p>
                        <p className="text-xs text-muted-foreground">{priceFmt.format(Math.round(toLocal(l.item.priceUSD * l.qty)))}</p>
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
              <Button disabled={groupedCart.length === 0} onClick={() => { if (groupedCart.length === 0) return; setCartOpen(false); setCheckoutOpen(true); }} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60">Go to Checkout</Button>
            </div>
          </PopoverContent>
        </Popover>
        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          currency={currency}
          lines={groupedCart.map((l) => ({ id: l.id, name: l.item.name, qty: l.qty, priceLocal: Math.round(toLocal(l.item.priceUSD * l.qty)) }))}
          totalLocal={totalLocalRounded}
          onRemoveOne={removeOne}
          onRemoveAll={removeAll}
        />
      </section>
    </div>
  );
}
