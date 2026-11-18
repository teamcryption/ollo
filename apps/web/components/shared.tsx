'use client';
// Shared controls and constants (kept out of Library.tsx to avoid circular imports).
import { UiIcon } from './ui-icons';

export const SWATCHES = [
  { id: 'ink', label: 'Ink', hex: '#171729' },
  { id: 'royal', label: 'Royal blue', hex: '#3A57FF' },
  { id: 'red', label: 'Red', hex: '#E5484D' },
  { id: 'amber', label: 'Amber', hex: '#F5A524' },
  { id: 'pink', label: 'Pink', hex: '#E93D82' },
];

export type AnimFormat = 'lottie' | 'dotlottie' | 'gif' | 'svg';
export const ANIM_FORMATS: { id: AnimFormat; label: string }[] = [
  { id: 'lottie', label: 'Lottie' },
  { id: 'dotlottie', label: '.lottie' },
  { id: 'gif', label: 'GIF' },
  { id: 'svg', label: 'SVG' },
];

/** Clipboard API first; falls back to a hidden textarea where the API is blocked. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {}
    ta.remove();
    return ok;
  }
}

export function Select({
  label,
  value,
  onChange,
  children,
  small,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  small?: boolean;
  className?: string;
}) {
  return (
    <span className={`select${small ? ' select-sm' : ''} ${className}`}>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
      <UiIcon name="chevron-down" size={16} />
    </span>
  );
}
