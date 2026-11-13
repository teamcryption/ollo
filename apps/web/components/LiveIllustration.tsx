'use client';
// One live (Hairline) illustration, in any style and theme, running animated, interactive or on scroll.
// Used by the grid tiles and the download popup.
import { useEffect, useRef, useState } from 'react';
import { liveStyle, mountLive, type LiveMode, type LiveStyle } from '@/lib/hairline';
import type { IllTheme } from '@/lib/illustration';

export function LiveIllustration({
  name,
  mode,
  style,
  theme,
  colour,
  root,
  tags = true,
}: {
  name: string;
  mode: LiveMode;
  style: LiveStyle;
  theme: IllTheme;
  colour: string | null;
  /** scroll box for scroll mode (default: the window) */
  root?: HTMLElement | null;
  tags?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [read, setRead] = useState('rest');
  useEffect(() => {
    let undo: (() => void) | null = null, gone = false;
    mountLive(ref.current!, name, mode, setRead, root).then((u) => (gone ? u() : (undo = u)));
    return () => { gone = true; undo?.(); };
  }, [name, mode, root]);
  return (
    <span className="ill-live" style={liveStyle(style, theme, colour)}>
      {tags && <span className="ill-tag kind">{mode === 'animated' ? 'ANIMATED' : mode === 'interactive' ? 'LIVE' : 'SCROLL'}</span>}
      {tags && <span className="ill-tag read" aria-live="polite">{read}</span>}
      <div ref={ref} data-hairline-theme={theme} />
    </span>
  );
}
