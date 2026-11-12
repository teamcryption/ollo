import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'text',
  icons: [
    icon('fountain-pen-flag', 'Report Fountain Pen', ['report', 'flag', 'mark', 'fountain pen', 'fountain-pen'], [body('M9.5 3.5l4.5 6-4.5 9-4.5-9Z'), line('M9.5 4v5'), line(D(9.5, 11.2)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('scroll-flag', 'Report Scroll', ['report', 'flag', 'mark', 'scroll', 'scroll'], [body(R(3.5, 3, 12, 2.3, 1.15)), body(R(5, 5.8, 9, 9.4, 0.6)), body(R(3.5, 15.7, 12, 2.3, 1.15)), line('M7 8.5h5M7 11h5M7 13h3'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('typewriter-flag', 'Report Typewriter', ['report', 'flag', 'mark', 'typewriter', 'typewriter'], [body(R(6, 3, 7, 4.6, 0.6)), body('M3.5 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2Z'), line(D(6.5, 12.3) + D(9.5, 12.3) + D(12.5, 12.3) + D(6.5, 15) + D(9.5, 15)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
