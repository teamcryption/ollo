'use client';
// Small motion toolkit for the marketing pages: scroll reveals, word-by-word headings, count-ups.
// Everything respects prefers-reduced-motion (the CSS turns animations off; count-ups jump to the end).
import { useEffect, useRef, useState, type ReactNode } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Adds `is-in` to every [data-reveal] element under `root` the first time it scrolls into view. */
export function useReveal(root: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // The flag is a data attribute React never manages, so re-renders that change className
    // (e.g. an FAQ item opening) can't wipe it and hide the element again.
    const targets = [...el.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])')];
    if (reduced() || !('IntersectionObserver' in window)) {
      targets.forEach((t) => t.setAttribute('data-in', ''));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute('data-in', '');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** True once the element has been on screen. */
export function useInView<T extends HTMLElement>(margin = '0px 0px -10% 0px') {
  const ref = useRef<T>(null);
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || !('IntersectionObserver' in window)) return setIn(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setIn(true), io.disconnect()), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}

/** Heading whose words rise in one after another (CSS: .words > .w). */
export function Words({ text, as: Tag = 'h2', className, delay = 0 }: { text: string; as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; delay?: number }) {
  return (
    <Tag className={`words${className ? ' ' + className : ''}`} data-reveal="" aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="w" aria-hidden="true" style={{ ['--i' as string]: i, ['--d' as string]: `${delay}ms` }}>
          {w}
          {' '}
        </span>
      ))}
    </Tag>
  );
}

/** Counts up to `to` when it scrolls into view. Non-numeric values just fade in. */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const target = Number(value.replace(/[^\d.]/g, ''));
  const numeric = /\d/.test(value) && Number.isFinite(target);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || !numeric) return;
    if (reduced()) return setN(target);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric, target, duration]);
  return (
    <span ref={ref} className={`count${inView ? ' is-in' : ''}`}>
      {numeric ? n.toLocaleString('en-US') + value.replace(/[\d,.]/g, '') : value}
    </span>
  );
}

/**
 * Eased mouse-wheel scrolling for the page: wheel deltas set a target and the window glides
 * towards it. Keyboard, scrollbar and touch scrolling stay native (we just re-sync). Off for
 * reduced motion, touch-first devices, ctrl+wheel zoom and wheels over inner scrollers.
 */
export function useSmoothScroll(ease = 0.12) {
  useEffect(() => {
    if (reduced() || window.matchMedia?.('(pointer: coarse)').matches) return;
    const doc = document.documentElement;
    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let ours = false;
    const max = () => doc.scrollHeight - window.innerHeight;
    const scrollsInside = (el: Element | null, dy: number) => {
      for (let n = el; n && n !== document.body && n !== doc; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (!/(auto|scroll)/.test(cs.overflowY) || n.scrollHeight <= n.clientHeight) continue;
        if (dy < 0 ? n.scrollTop > 0 : n.scrollTop + n.clientHeight < n.scrollHeight - 1) return true;
      }
      return false;
    };
    const step = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.5) current = target;
      ours = true;
      window.scrollTo(0, current);
      raf = current === target ? 0 : requestAnimationFrame(step);
    };
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (scrollsInside(e.target as Element, e.deltaY)) return;
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!raf) current = window.scrollY;
      target = Math.max(0, Math.min(max(), target + dy));
      if (!raf) raf = requestAnimationFrame(step);
    };
    const sync = () => {
      if (ours) return void (ours = false);
      if (raf) return;
      target = current = window.scrollY;
    };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('scroll', sync, { passive: true });
    doc.classList.add('smooth-scroll');
    return () => {
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('scroll', sync);
      cancelAnimationFrame(raf);
      doc.classList.remove('smooth-scroll');
    };
  }, [ease]);
}

/** Button label whose letters roll up one after another on hover (CSS: .roll). */
export function Roll({ text }: { text: string }) {
  return (
    <span className="roll-text">
      <span className="roll-sr">{text}</span>
      <span className="roll" aria-hidden="true">
        {[...text].map((c, i) => (
          <span key={i} style={{ ['--i' as string]: i }}>
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Wraps children so they lift into place on reveal; `i` staggers siblings. */
export const Reveal = ({ children, i = 0, as: Tag = 'div', className }: { children: ReactNode; i?: number; as?: 'div' | 'section' | 'li' | 'span'; className?: string }) => (
  <Tag className={`rv${className ? ' ' + className : ''}`} data-reveal="" style={{ ['--i' as string]: i }}>
    {children}
  </Tag>
);
