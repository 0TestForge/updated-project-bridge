import { useEffect, useMemo, useState } from "react";

export interface GeoInfo {
  country?: string;
  currency?: string;
  language?: string;
}

export function useGeo(): GeoInfo {
  const [info, setInfo] = useState<GeoInfo>({});

  useEffect(() => {
    let mounted = true;

    // Respect user override and avoid network if set
    try {
      const override = localStorage.getItem("currencyOverride");
      if (override) {
        setInfo((prev) => ({ ...prev, currency: override || undefined }));
        mounted = false; // skip remote geo if overridden
      }
    } catch {}

    const fetchGeo = async () => {
      if (!mounted) return;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      try {
        // Primary provider
        let country: string | undefined;
        let currency: string | undefined;
        try {
          const res = await fetch("https://ipapi.co/json/", {
            signal: controller.signal,
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            const data = await res.json();
            country = data?.country || data?.country_code || undefined;
            currency = data?.currency || undefined;
          }
        } catch {}
        // Fallback provider (country only)
        if (!country) {
          try {
            const res2 = await fetch("https://ipwho.is/?fields=country,currency", { signal: controller.signal });
            if (res2.ok) {
              const data2 = await res2.json();
              country = data2?.country || undefined;
              currency = data2?.currency?.code || currency || undefined;
            }
          } catch {}
        }
        clearTimeout(timeout);
        if (!mounted) return;
        if (country || currency) setInfo((prev) => ({ ...prev, country, currency }));
      } catch {
        // fully silent fallback
      }
    };

    fetchGeo();
    return () => {
      mounted = false;
    };
  }, []);

  const languageName = useMemo(() => {
    try {
      const langCode = navigator?.language || "en";
      // Use Intl to render a human-readable language name
      // Some environments may not support Intl.DisplayNames
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DN: any = (Intl as any).DisplayNames;
      if (DN) {
        const dn = new DN([langCode], { type: "language" });
        return dn.of(langCode) || "English";
      }
      return langCode.startsWith("en") ? "English" : langCode;
    } catch {
      return "English";
    }
  }, []);

  return { ...info, language: languageName };
}
