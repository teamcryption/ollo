import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'text',
  icons: [
    icon('fountain-pen-checkbox', 'Approve Fountain Pen', ['approve', 'check', 'verified', 'fountain pen', 'fountain-pen'], [body('M9.5 3.5l4.5 6-4.5 9-4.5-9Z'), line('M9.5 4v5'), line(D(9.5, 11.2)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('scroll-checkbox', 'Approve Scroll', ['approve', 'check', 'verified', 'scroll', 'scroll'], [body(R(3.5, 3, 12, 2.3, 1.15)), body(R(5, 5.8, 9, 9.4, 0.6)), body(R(3.5, 15.7, 12, 2.3, 1.15)), line('M7 8.5h5M7 11h5M7 13h3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('typewriter-checkbox', 'Approve Typewriter', ['approve', 'check', 'verified', 'typewriter', 'typewriter'], [body(R(6, 3, 7, 4.6, 0.6)), body('M3.5 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2Z'), line(D(6.5, 12.3) + D(9.5, 12.3) + D(12.5, 12.3) + D(6.5, 15) + D(9.5, 15)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('highlighter-checkbox', 'Approve Highlighter', ['approve', 'check', 'verified', 'highlighter', 'highlighter'], [body(rotateD(R(7.5, 3, 4, 9, 1), 40, 9.5, 10.5)), body(rotateD('M8 12.3h3l-.5 3h-2Z', 40, 9.5, 10.5)), line('M3.5 18h7'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('typography-checkbox', 'Approve Typography', ['approve', 'check', 'verified', 'typography', 'typography'], [line('M3.5 5.5V4h8v1.5M7.5 4v12M5.5 16h4'), line('M11.5 10.5h5M14 10.5V16M13 16h2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
  ],
};
