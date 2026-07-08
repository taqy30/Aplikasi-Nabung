"use client";

import { useCallback, useEffect, useState } from "react";

export const FUND_SOURCE_PINS_STORAGE_KEY = "rekapuang_fund_pins_v1";

/** Cash selalu di dashboard; user bisa sematkan hingga sebanyak ini. */
export const MAX_USER_FUND_SOURCE_PINS = 5;

function readPinsFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FUND_SOURCE_PINS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((slug) => slug.trim().toLowerCase())
      .filter((slug) => slug.length > 0 && slug !== "cash")
      .slice(0, MAX_USER_FUND_SOURCE_PINS);
  } catch {
    return [];
  }
}

function writePinsToStorage(slugs: string[]) {
  try {
    localStorage.setItem(FUND_SOURCE_PINS_STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // ignore quota / private mode
  }
}

export type TogglePinResult =
  | { ok: true; pinned: boolean }
  | { ok: false; reason: string };

export function useFundSourcePins() {
  const [pins, setPins] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPins(readPinsFromStorage());
    setReady(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === FUND_SOURCE_PINS_STORAGE_KEY) {
        setPins(readPinsFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isPinned = useCallback(
    (slug: string) => {
      if (slug === "cash") return true;
      return pins.includes(slug);
    },
    [pins]
  );

  const togglePin = useCallback(
    (slug: string): TogglePinResult => {
      if (slug === "cash") {
        return { ok: false, reason: "Cash selalu tampil di dashboard." };
      }

      const current = readPinsFromStorage();
      const exists = current.includes(slug);

      if (exists) {
        const next = current.filter((s) => s !== slug);
        writePinsToStorage(next);
        setPins(next);
        return { ok: true, pinned: false };
      }

      if (current.length >= MAX_USER_FUND_SOURCE_PINS) {
        return {
          ok: false,
          reason: `Maksimal ${MAX_USER_FUND_SOURCE_PINS} penyimpanan disematkan (selain Cash).`,
        };
      }

      const next = [...current, slug];
      writePinsToStorage(next);
      setPins(next);
      return { ok: true, pinned: true };
    },
    []
  );

  return {
    pins,
    ready,
    isPinned,
    togglePin,
    maxPins: MAX_USER_FUND_SOURCE_PINS,
    pinCount: pins.length,
  };
}
