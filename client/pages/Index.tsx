import { Button } from "@/components/ui/button";
import { SelectGameDialog } from "@/components/SelectGameDialog";
import { ReviewsMarquee } from "@/components/ReviewsMarquee";

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F9a2afb70ccde4b09ae6f1817c0abebd1?format=webp&width=1600"
          alt="Hero banner"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/10 via-background/15 to-background/20" />
        <div className="container pt-20 md:pt-28 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-transparent backdrop-blur-sm text-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F3af3d652d1b7456abc1b7ab7bd0ec9c4?format=webp&width=1600"
                alt="container background"
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
              />
              <div className="px-6 py-10 md:px-12 md:py-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                    <img src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2Fb416b769d9a641f7b46b99fef8220342?format=webp&width=64" alt="icon" className="h-3.5 w-3.5 object-contain" />
                    4.9 stars rating
                  </span>
                  Safe checkout • Instant delivery
                </div>
                <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
                  Instantly Buy Your Favorite Items Fast, Safe, and Easy!
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  The fastest, safest shop for in‑game items with automated delivery. Get what you need in seconds.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <SelectGameDialog>
                    <Button className="h-12 px-6 text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25">Shop Now</Button>
                  </SelectGameDialog>
                  <SelectGameDialog>
                    <Button variant="secondary" className="h-12 px-6 text-base border border-white/10 bg-white/5 hover:bg-white/10">Select Game</Button>
                  </SelectGameDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Instant Delivery",
              desc: "Automated system fulfills orders within seconds, 24/7.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 12l4-4M3 12l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ),
            },
            {
              title: "Secure & Trusted",
              desc: "Protected checkout and verified sellers you can rely on.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 4v5c0 5-3.5 9-7 9S5 17 5 12V7l7-4z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
              ),
            },
            {
              title: "Best Prices",
              desc: "Competitive deals and seasonal discounts on top items.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2"/></svg>
              ),
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/15 bg-transparent p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mid-page decorative background section */}
      <section className="container py-10 md:py-16">
        <div
          className="relative h-64 md:h-80 rounded-3xl border border-white/15 overflow-hidden"
          style={{
            backgroundImage:
              "url(https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F7a8e5eb0932d4db78fb4273257260f68?format=webp&width=1600)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 via-emerald-600/10 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="w-full">
              <ReviewsMarquee count={982} />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container py-16">
        <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {["Choose a game","Pick your items","Pay & receive instantly"].map((step, i) => (
            <div key={step} className="rounded-2xl border border-white/15 bg-transparent p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold">{step}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Seamless flow designed for speed and safety at every step.</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            {
              q: "How fast is delivery?",
              a: "Most orders are completed within seconds by our automated system.",
            },
            { q: "Is checkout secure?", a: "Yes. We use encrypted payments with industry‑standard protection." },
            { q: "Do you offer refunds?", a: "If an order can't be fulfilled, you'll be refunded promptly." },
            { q: "Which games are supported?", a: "We support popular titles and are adding more regularly." },
          ].map((i) => (
            <details key={i.q} className="group rounded-xl border border-white/15 bg-transparent p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                <span>{i.q}</span>
                <span className="ml-4 grid place-content-center rounded-md border border-white/10 p-1 text-muted-foreground group-open:rotate-45 transition-transform">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"/></svg>
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{i.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
