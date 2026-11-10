import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'text',
  icons: [
    icon('highlight-text', 'Highlight Text', ['highlighter', 'marker', 'emphasis', 'text', 'format'], [line('M14 4.5l4 4-6 6H8v-4Z'), line('M4 20h16')], { noAccent: true }),
    icon('uppercase', 'Uppercase', ['all caps', 'capitals', 'case', 'text', 'format'], [line('M3.5 17 7 7l3.5 10M4.7 13.5h4.6M13.5 17 17 7l3.5 10M14.7 13.5h4.6')], { noAccent: true }),
    icon('sentence-case', 'Sentence Case', ['capitalise', 'case', 'Aa', 'text', 'format'], [line('M3.5 17 7 7l3.5 10M4.7 13.5h4.6'), line(C(16, 14.5, 2.5)), line('M18.5 12v5')], { noAccent: true }),
  ],
};
