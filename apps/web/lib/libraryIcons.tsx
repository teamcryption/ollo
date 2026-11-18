'use client';
// Real library icons in chosen styles (home Light, bell Regular…) for marketing surfaces:
// the auth panel, welcome screen, landing page and pricing cards.
import { useEffect, useState } from 'react';
import { loadIcons, loadIndex, type IconStyle } from './data';

export function useLibraryIcons(want: [string, IconStyle][]) {
  const key = want.map((w) => w.join(':')).join(',');
  const [svgs, setSvgs] = useState<Record<string, string>>({});
  useEffect(() => {
    let live = true;
    loadIndex().then(async (index) => {
      const byName = new Map(index.icons.map((i) => [i.n, i]));
      const out: Record<string, string> = {};
      const styles = [...new Set(want.map((w) => w[1]))];
      for (const s of styles) {
        const entries = want.filter((w) => w[1] === s).map((w) => byName.get(w[0])).filter(Boolean) as typeof index.icons;
        const got = await loadIcons(entries, s);
        for (const [n, svg] of Object.entries(got)) out[`${n}:${s}`] = svg;
      }
      if (live) setSvgs(out);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return svgs;
}

export const LibIcon = ({ svg, className }: { svg?: string; className?: string }) =>
  svg ? (
    <span className={`lib-icon${className ? ' ' + className : ''}`} dangerouslySetInnerHTML={{ __html: svg }} />
  ) : (
    <span className={`lib-icon${className ? ' ' + className : ''}`} />
  );
