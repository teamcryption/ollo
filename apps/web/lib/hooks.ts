'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

/** Theme lives on <html data-theme>; the inline script in layout.tsx sets it before paint. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);
  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('ollo-theme', next);
      } catch {}
      return next;
    });
  }, []);
  return [theme, toggle];
}

/** A small persisted list of names (recently used, favourites). Newest first. */
export function useLocalList(key: string, max: number) {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(key) ?? '[]');
      if (Array.isArray(v)) setItems(v.filter((x) => typeof x === 'string'));
    } catch {}
  }, [key]);
  const save = (next: string[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
    return next;
  };
  const push = useCallback(
    (n: string) => setItems((cur) => save([n, ...cur.filter((x) => x !== n)].slice(0, max))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, max],
  );
  const toggle = useCallback(
    (n: string) => setItems((cur) => save(cur.includes(n) ? cur.filter((x) => x !== n) : [n, ...cur].slice(0, max))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, max],
  );
  return { items, push, toggle };
}
