import { useEffect, useState } from "react";

const isBrowser = typeof window !== "undefined";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    if (!isBrowser) return initialValue;
    return safeParse<T>(window.localStorage.getItem(key), initialValue);
  });

  useEffect(() => {
    if (!isBrowser) return;
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}

