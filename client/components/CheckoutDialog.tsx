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
  const [method] = useState<"card">("card");
  const [paying, setPaying] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [robloxUser, setRobloxUser] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);
  const [payStatus, setPayStatus] = useState<"processing" | "succeeded">("processing");

  const digits = (s: string) => s.replace(/\D+/g, "");

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
              <div className="relative overflow-hidden rounded-xl border border-blue-800/60 bg-[#081433]/50 p-4">
                <p className="flex items-center gap-2 text-sm text-blue-200/80"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-sky-400"><path d="M12 2l7 4v5c0 5-3.5 9-7 11-3.5-2-7-6-7-11V6l7-4z"/></svg><span>Protected by Stripe</span></p>
                <div className="grid grid-cols-2 gap-3">
                  <input value={cardName} onChange={(e) => setCardName(e.target.value)} className="col-span-2 h-11 rounded-md border border-blue-900/60 bg-[#050B1F]/70 px-3 text-sm placeholder:text-blue-300/50" placeholder="Cardholder name" />
                  <div className="col-span-2 relative"><input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="h-11 w-full rounded-md border border-blue-900/60 bg-[#050B1F]/70 px-3 pr-16 text-sm" placeholder="Card number" inputMode="numeric" /><span className="pointer-events-none absolute inset-y-0 right-2 grid place-content-center text-[10px] font-semibold text-blue-200/80 rounded px-1.5 bg-blue-900/40 border border-blue-800/60">{(()=>{const n=digits(cardNumber); if(/^4/.test(n)) return "VISA"; if(/^(5[1-5]|2(2[2-9]|[3-6][0-9]|7[01]))/.test(n)) return "MC"; if(/^(34|37)/.test(n)) return "AMEX"; if(/^(6011|65|64[4-9])/.test(n)) return "DISC"; return "CARD";})()}</span></div>
                  <input value={cardExp} onChange={(e) => setCardExp(e.target.value)} className="h-11 rounded-md border border-blue-900/60 bg-[#050B1F]/70 px-3 text-sm" placeholder="MM/YY" inputMode="numeric" />
                  <input value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="h-11 rounded-md border border-blue-900/60 bg-[#050B1F]/70 px-3 text-sm" placeholder="CVC" inputMode="numeric" />
                </div>
                {cardError && <p className="mt-2 text-xs text-red-300">{cardError}</p>}
                <div className="mt-3">
                  <Button
                    className="w-full bg-sky-400 text-slate-900 hover:bg-sky-300 transition-transform hover:-translate-y-px shadow-lg shadow-sky-500/20 disabled:opacity-60"
                    disabled={paying}
                    onClick={async () => {
                      try {
                        setPaying(true);
                        const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: (Array.isArray(lines)? lines:[]).map(l=>({ name: l.name, qty: l.qty, priceLocal: l.priceLocal })), currency }) });
                        const data = await res.json();
                        if (res.ok && data?.url) { window.location.assign(data.url); return; }
                        setCardError(data?.error || "Failed to start Stripe Checkout.");
                      } catch (e: any) {
                        setCardError(e?.message || "Failed to start Stripe Checkout.");
                      } finally {
                        setPaying(false);
                      }
                    }}
                  >
                    {paying ? "Redirecting…" : `Pay with Stripe (${new Intl.NumberFormat(undefined, { style: "currency", currency }).format(totalLocal)})`}
                  </Button>
                </div>

                {paying && (
                  <div className="pointer-events-none absolute inset-0 grid place-content-center bg-[#050B1F]/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 animate-in fade-in-0">
                      {payStatus === "processing" ? (
                        <>
                          <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-400/60 border-t-transparent" />
                          <div className="text-sm text-blue-200/80">Processing payment…</div>
                        </>
                      ) : (
                        <>
                          <div className="grid h-10 w-10 place-content-center rounded-full bg-violet-500/90 text-slate-900">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                          <div className="text-sm text-violet-300">Payment succeeded</div>
                        </>
                      )}
                      <div className="mt-1 h-1 w-40 overflow-hidden rounded-full bg-blue-900/60">
                        <div className="h-full w-1/2 animate-[progress_1.2s_ease-in-out_infinite] rounded-full bg-sky-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary column */}
            <aside className="space-y-3 rounded-xl border border-blue-800/60 bg-[#081433]/50 p-4">
              <h3 className="text-sm font-semibold text-blue-100">Order Summary</h3>
              <ul className="space-y-2 max-h-64 overflow-auto pr-1 scrollbar-blue">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {l.thumb ? (
                        <img src={l.thumb} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                      ) : null}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{l.name} × {l.qty}</p>
                        <p className="text-xs text-blue-200/80">{new Intl.NumberFormat(undefined, { style: "currency", currency }).format(l.priceLocal)}</p>
                      </div>
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

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-md overflow-hidden border border-blue-700/40 bg-gradient-to-br from-[#050B1F] to-[#081433] text-blue-50">
          <DialogHeader>
            <DialogTitle className="text-blue-100">Delivery Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-800/60 bg-[#081433]/60 p-3">
              <div className="text-sm text-blue-200/80">Order ID</div>
              <div className="mt-1 flex items-center justify-between rounded-md bg-[#050B1F]/70 px-3 py-2 text-sm">
                <span className="truncate font-mono">{orderId}</span>
                <button
                  className="rounded bg-sky-500/90 px-2 py-1 text-xs font-semibold text-slate-900 hover:bg-sky-400"
                  onClick={() => orderId && navigator.clipboard.writeText(orderId)}
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-xs text-blue-200/70">Keep this ID handy for support.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-blue-200/90">Your Roblox username</label>
              <input
                value={robloxUser}
                onChange={(e) => setRobloxUser(e.target.value)}
                className="h-11 w-full rounded-md border border-blue-900/60 bg-[#050B1F]/70 px-3 text-sm placeholder:text-blue-300/50"
                placeholder="Enter Roblox username"
              />
              <p className="text-xs text-blue-200/70">A staff member will message you on Roblox shortly to deliver your items.</p>
            </div>

            <div className="space-y-2 rounded-lg border border-blue-800/60 bg-[#081433]/60 p-3">
              <div className="text-xs text-blue-200/70">Status</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-violet-400" />
                <span className="text-sm">Waiting for staff…</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="bg-slate-200 text-slate-900 hover:bg-white"
                onClick={() => setChatOpen(false)}
              >
                Close
              </Button>
              <Button
                className="bg-sky-400 text-slate-900 hover:bg-sky-300 disabled:opacity-60"
                disabled={!robloxUser.trim()}
                onClick={() => {
                  const u = robloxUser.trim();
                  const id = orderId || "";
                  setChatOpen(false);
                  const url = `/chat?orderId=${encodeURIComponent(id)}&user=${encodeURIComponent(u)}`;
                  window.open(url, "_blank");
                }}
              >
                Start Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
