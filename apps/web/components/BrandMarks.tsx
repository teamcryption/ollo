// Brand marks for the landing page "Works with" row (Figma Design System › Brand/*).
// Simplified marks of each product, used only to say ollo works with them.
export type BrandId = 'figma' | 'react' | 'html' | 'svg' | 'lottie' | 'framer' | 'webflow' | 'notion' | 'keynote';

const MARKS: Record<BrandId, { vb: string; body: string }> = {
  figma: {
    vb: '-9.5 0 57 57',
    body: '<path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/><path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83"/><path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262"/><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/>',
  },
  react: {
    vb: '-12 -12 24 24',
    body: '<circle r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" fill="none" stroke-width="1.1"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g>',
  },
  html: {
    vb: '0 0 24 24',
    body: '<path fill="#E34F26" d="M3.2 1.5h17.6l-1.6 18.1L12 22.5l-7.2-2.9z"/><path fill="#EF652A" d="M12 3.2v17.5l5.8-2.3 1.4-15.2z"/><path fill="#fff" d="M12 9.4H8.6l-.24-2.7H12V4.1H5.6l.7 7.9H12zm0 6.8-2.9-.8-.18-2.05H6.3l.37 4.2 5.33 1.5z"/><path fill="#fff" d="M12 9.4v2.6h3.1l-.3 3.3-2.8.8v2.7l5.2-1.4.64-7.1.07-.9zm0-5.3v2.6h6.1l.22-2.6z"/>',
  },
  svg: {
    vb: '0 0 24 24',
    body: '<rect x="1" y="1" width="22" height="22" rx="6" fill="#FFB13B"/><g fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 3.5v3.3M12 17.2v3.3M3.5 12h3.3M17.2 12h3.3M6 6l2.3 2.3M15.7 15.7 18 18M18 6l-2.3 2.3M8.3 15.7 6 18"/></g>',
  },
  lottie: {
    vb: '0 0 24 24',
    body: '<rect x="1" y="1" width="22" height="22" rx="6" fill="#00DDB3"/><path d="M6.5 17.5c3.2 0 4.2-3 5.2-5.6 1-2.6 1.9-5.2 5.8-5.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>',
  },
  framer: { vb: '0 0 24 24', body: '<path fill="currentColor" d="M5 1h14v7h-7zM5 8h7l7 7h-7v7l-7-7z"/>' },
  webflow: {
    vb: '0 0 24 24',
    body: '<rect x="1" y="1" width="22" height="22" rx="6" fill="#146EF5"/><path fill="#fff" d="M19.2 7.6l-3.2 9.1h-2.6l-1.5-4.3-1.6 4.3H7.7L4.8 7.6h2.6l1.6 5 1.7-5h2.5l1.7 5 1.7-5z"/>',
  },
  notion: {
    vb: '0 0 24 24',
    body: '<rect x="2.5" y="2" width="19" height="20" rx="3.5" fill="#fff" stroke="#000" stroke-width="1.6"/><path fill="#000" d="M7.6 6.8h2.2l4.4 6.9V6.8h2v10.4H14l-4.4-6.8v6.8h-2z"/>',
  },
  keynote: {
    vb: '0 0 24 24',
    body: '<rect x="1" y="1" width="22" height="22" rx="6" fill="#0A84FF"/><rect x="5" y="5.5" width="14" height="8.5" rx="1.4" fill="#fff"/><path fill="#fff" d="M11 14h2v4.5h3v1.5H8v-1.5h3z"/><path fill="#0A84FF" d="M8 11.5l2.6-3 2 2.1 1.6-1.6L16 11.5z"/>',
  },
};

export function BrandMark({ id, size = 16 }: { id: BrandId; size?: number }) {
  const m = MARKS[id];
  return <svg width={size} height={size} viewBox={m.vb} aria-hidden="true" dangerouslySetInnerHTML={{ __html: m.body }} />;
}
