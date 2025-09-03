import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface CheckoutLine {
  id: string;
  name: string;
  qty: number;
  priceLocal: number;
  thumb?: string;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  currency,
  lines,
  totalLocal,
  onRemoveOne,
  onRemoveAll,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currency: string;
  lines: CheckoutLine[];
  totalLocal: number;
  onRemoveOne: (id: string) => void;
  onRemoveAll: (id: string) => void;
}) {
  const [method, setMethod] = useState<"card" | "apple" | "google" | "crypto">("card");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden border border-[#0B3B91]/40 bg-gradient-to-br from-[#050B1F] to-[#081433] text-blue-50">
        <div className="flex h-full flex-col">
          <DialogHeader className="sticky top-0 z-10 bg-gradient-to-b from-[#050B1F]/95 to-[#081433]/92 backdrop-blur supports-[backdrop-filter]:bg-[#050B1F]/70">
            <DialogTitle className="text-blue-100">Checkout</DialogTitle>
            {/* Straight stepper with dots */}
            <div className="mt-3">
              <div className="relative h-8">
                <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[2px] bg-blue-800/50" />
                <div className="relative z-10 flex items-center justify-between px-2">
                  {[
                    { k: "Cart", active: false },
                    { k: "Payment", active: true },
                    { k: "Confirm", active: false },
                  ].map((s, i) => (
                    <div key={s.k} className="flex flex-col items-center">
                      <div className={`${s.active ? "bg-sky-400 shadow-[0_0_0_3px_rgba(56,189,248,0.25)]" : "bg-blue-900"} h-4 w-4 rounded-full ring-2 ring-blue-400/60 transition-all`} />
                      <span className="mt-1 text-[11px] opacity-80">{s.k}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="grid flex-1 gap-6 overflow-auto p-6 scrollbar-blue md:grid-cols-[1fr_340px]">
            {/* Payment column */}
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-800/60 bg-[#081433]/50 p-3 max-h-64 overflow-y-auto scrollbar-blue">
                <div className="space-y-3">
                  {[{ id: "card", label: "Pay with Card" }, { id: "apple", label: "Apple Pay" }, { id: "google", label: "Google Pay" }, { id: "crypto", label: "Crypto" }].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id as any)}
                      className={`group w-full rounded-xl border p-5 text-left transition-all duration-200 ${
                        method === m.id
                          ? "border-sky-400/70 bg-[#0A1F4D]/50 shadow-[0_0_0_3px_rgba(56,189,248,0.15)]"
                          : "border-blue-800/60 bg-[#081433]/40 hover:border-sky-400/50 hover:bg-[#0A1F4D]/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-content-center rounded-lg bg-[#081433]/80 ring-1 ring-blue-700/50">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-blue-200">
                            <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="font-semibold tracking-wide">{m.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Method detail */}
              {method === "card" && (
                <div className="space-y-3 rounded-xl border border-blue-800/60 bg-[#081433]/50 p-4">
                  <p className="text-sm text-blue-200/80">Secure card payment (connect Stripe to enable live processing).</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="col-span-2 h-11 rounded-md border border-blue-900/60 bg-[#050B1F]/70 px-3 text-sm placeholder:text-blue-300/50" placeholder="Cardholder name" />
                    <input className="col-span-2 h-11 rounded-md border border-blue-900/60 bg-[#050B1F]/70 px-3 text-sm" placeholder="Card number" inputMode="numeric" />
                    <input className="h-11 rounded-md border border-blue-900/60 bg-[#050B1F]/70 px-3 text-sm" placeholder="MM/YY" inputMode="numeric" />
                    <input className="h-11 rounded-md border border-blue-900/60 bg-[#050B1F]/70 px-3 text-sm" placeholder="CVC" inputMode="numeric" />
                  </div>
                  <Button className="w-full bg-sky-400 text-slate-900 hover:bg-sky-300 transition-transform hover:-translate-y-px shadow-lg shadow-sky-500/20">
                    Pay {new Intl.NumberFormat(undefined, { style: "currency", currency }).format(totalLocal)}
                  </Button>
                </div>
              )}
              {method === "apple" && (
                <div className="space-y-3 rounded-xl border border-blue-800/60 bg-[#081433]/50 p-4">
                  <p className="text-sm text-blue-200/80">Apple Pay requires Stripe + verified merchant domain.</p>
                  <Button className="w-full bg-slate-100 text-slate-900 hover:bg-white">Continue with Apple Pay</Button>
                </div>
              )}
              {method === "google" && (
                <div className="space-y-3 rounded-xl border border-blue-800/60 bg-[#081433]/50 p-4">
                  <p className="text-sm text-blue-200/80">Google Pay requires gateway configuration.</p>
                  <Button className="w-full bg-slate-100 text-slate-900 hover:bg-white">Continue with Google Pay</Button>
                </div>
              )}
              {method === "crypto" && (
                <div className="space-y-3 rounded-xl border border-blue-800/60 bg-[#081433]/50 p-4">
                  <p className="text-sm text-blue-200/80">Connect Coinbase Commerce to accept crypto payments.</p>
                  <Button className="w-full bg-slate-100 text-slate-900 hover:bg-white">Pay with Crypto</Button>
                </div>
              )}
            </div>

            {/* Summary column */}
            <aside className="space-y-3 rounded-xl border border-blue-800/60 bg-[#081433]/50 p-4">
              <h3 className="text-sm font-semibold text-blue-100">Order Summary</h3>
              <ul className="space-y-2 max-h-64 overflow-auto pr-1 scrollbar-blue">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{l.name} × {l.qty}</p>
                      <p className="text-xs text-blue-200/80">{new Intl.NumberFormat(undefined, { style: "currency", currency }).format(l.priceLocal)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onRemoveOne(l.id)}>−</Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-blue-900/60 pt-3">
                <span className="text-sm text-blue-200/80">Total</span>
                <span className="text-sm font-semibold">{new Intl.NumberFormat(undefined, { style: "currency", currency }).format(totalLocal)}</span>
              </div>
            </aside>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
