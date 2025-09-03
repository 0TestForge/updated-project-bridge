import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const BASE = [
  { text: "Service was fast", user: "@alex", note: "Verified purchase", rating: 5 },
  { text: "So cheap bro", user: "@mike", note: "Great value", rating: 5 },
  { text: "Trusted", user: "@sara", note: "3rd order", rating: 5 },
  { text: "Instant delivery", user: "@lee", note: "Arrived in seconds", rating: 5 },
  { text: "Top quality", user: "@nina", note: "Exactly as described", rating: 4 },
  { text: "Great support", user: "@omar", note: "Helpful team", rating: 5 },
  { text: "10/10 would recommend", user: "@ivy", note: "Smooth checkout", rating: 5 },
  { text: "Will buy again", user: "@rob", note: "Returning customer", rating: 5 },
  { text: "Secure checkout", user: "@zoe", note: "Protected payment", rating: 5 },
  { text: "Best prices", user: "@ken", note: "Saved money", rating: 4 },
  { text: "Lightning quick", user: "@mei", note: "Super fast", rating: 5 },
  { text: "Excellent experience", user: "@liam", note: "Flawless", rating: 5 },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-300">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          className={i < rating ? "fill-current" : "fill-transparent"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsMarquee({ count = 982 }: { count?: number }) {
  const items = [...BASE, ...BASE];
  const avg = (BASE.reduce((s, r) => s + r.rating, 0) / BASE.length).toFixed(1);

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs md:text-sm text-emerald-100 ring-1 ring-emerald-400/25 shadow-sm shadow-emerald-800/30">
          <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-300">
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
          </svg>
          <strong className="font-semibold text-emerald-100">{count.toLocaleString()} user reviews</strong>
        </span>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-300">
            <Stars rating={Math.round(Number(avg))} />
          </div>
          <span className="text-sm font-medium text-emerald-100">{avg} average rating</span>
          <span className="text-xs text-emerald-200/80">Based on {count.toLocaleString()} reviews</span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-emerald-950/30 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-emerald-950/30 to-transparent" />

          <div className="marquee-track flex w-max gap-4 pr-4">
            {items.map((r, i) => (
              <Tooltip key={`${r.text}-${i}`}>
                <TooltipTrigger asChild>
                  <div
                    className="group min-w-[280px] md:min-w-[380px] max-w-sm cursor-default rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5 md:p-6 text-left text-emerald-50 shadow-xl shadow-emerald-800/10 backdrop-blur-md transition-transform duration-300 ease-out hover:scale-[1.03] hover:shadow-emerald-700/20 hover:ring-1 hover:ring-emerald-400/30 float-slow"
                    style={{ animationDelay: `${(i % 6) * 120}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <Stars rating={r.rating} />
                      <span className="text-xs text-emerald-200/75">{r.user}</span>
                    </div>
                    <p className="mt-2 text-base md:text-lg font-semibold leading-snug">{r.text}</p>
                    <p className="mt-1 text-xs text-emerald-200/90">
                      {r.note}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-emerald-50">
                  {r.note}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
