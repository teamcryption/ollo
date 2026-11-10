// Shared combo pieces for batch specs: modifiers (bottom-right, cover) and compact bases (top-left).
export const HEARTP = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
export const M = {
  search: `body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')`,
  clock: `body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')`,
  shield: `body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })`,
  gear: `body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))`,
  pin: `body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))`,
  star: `body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })`,
  bolt: `body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })`,
  lock: `line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })`,
  heart: `body(translateD(scaleD('${HEARTP}', 0.42), 5.3, 4.8), { cover: true })`,
};
export const B = {
  bank: `body(poly([[9.5, 3.5], [16, 7], [3, 7]], 0.8, true)), line('M5.5 9.5v5M9.5 9.5v5M13.5 9.5v5M3 17.5h12')`,
  book: `body(R(3, 4, 11, 15, 2)), line('M6 4.2v14.6')`,
  hospital: `body(R(3.5, 4, 12, 15.5, 1.5)), line('M9.5 7.5v4M7.5 9.5h4')`,
  airplane: `body('M9.5 3.5c.8 0 1.2.8 1.2 1.8V9l5 3v1.8l-5-1.5v3.5l1.8 1.4V19l-3-.9-3 .9v-1.8l1.8-1.4v-3.5l-5 1.5V12l5-3V5.3c0-1 .4-1.8 1.2-1.8Z')`,
  school: `line('M9.5 6V2.8l2.5 1-2.5 1'), body(poly([[3, 11], [9.5, 6.5], [16, 11], [16, 19], [3, 19]], 1, true)), line('M8 19v-3.5h3V19')`,
  bag: `line('M7 7.5V6.5a2.5 2.5 0 0 1 5 0v1'), body('M4.5 8.8A1.3 1.3 0 0 1 5.8 7.5h7.4a1.3 1.3 0 0 1 1.3 1.3l.6 8.5a1.8 1.8 0 0 1-1.8 1.9H5.7a1.8 1.8 0 0 1-1.8-1.9Z')`,
  cart: `line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5))`,
  gift: `body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8')`,
  invoice: `body(R(4, 3.5, 11.5, 15.5, 2)), line('M7 7.5h5.5M7 10.5h5.5M7 13.5h3')`,
  laptop: `body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10')`,
  map: `body(poly([[3.5, 6], [9, 4], [15, 6], [20.5, 4], [20.5, 18], [15, 20], [9, 18], [3.5, 20]], 1, true)), line(L(9, 4.4, 9, 17.6))`,
  message: `body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z')`,
  package: `body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5')`,
  store: `line('M3 9 4.5 4.5h10L16 9'), body(R(4, 9, 11, 10, 1.2)), line('M7.5 19v-4h3v4')`,
  tag: `body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line(D(6.5, 6.5))`,
  ticket: `body('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V9a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 13.5V12a1.5 1.5 0 0 0 0-3Z'), line('M11 6.5v1.5M11 10v1M11 13v1.5')`,
};
// LIST rows: [base, modifier, title, 'comma, separated, tags', category]
export function combos(list, out = {}) {
  for (const [b, m, title, tags, cat] of list) {
    const t = tags.split(', ').concat([b]).map((x) => `'${x}'`).join(', ');
    (out[cat] ??= []).push(`icon('${b}-${m}', '${title}', [${t}], [${B[b]}, ${M[m]}], { noAccent: true })`);
  }
  return out;
}
