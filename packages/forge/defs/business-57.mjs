import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('scale-bulb', 'Justice Scale Ideas', ['idea', 'tip', 'insight', 'justice scale', 'scale'], [line('M9.5 3.5v14M6 17.8h7M5 6h9'), line('M5 6.2l-2 4.2M5 6.2l2 4.2M14 6.2l-2 4.2M14 6.2l2 4.2'), body('M2.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M11.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('presentation-bulb', 'Presentation Ideas', ['idea', 'tip', 'insight', 'presentation', 'presentation'], [body(R(3, 3.5, 13, 9, 1.2)), line('M9.5 12.5V15M6.5 18l3-3 3 3'), line('M6 9.5l2.5-2.5 2 2L13 6.5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('paper-shredder-bulb', 'Paper Shredder Ideas', ['idea', 'tip', 'insight', 'paper shredder', 'paper-shredder'], [body(R(3, 4, 13, 7, 1.5)), line('M6 7.5h7'), line('M5 11.2V17M7.5 11.2V18M10 11.2V16.5M12.5 11.2V18M14.5 11.2V17'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('desk-bulb', 'Desk Ideas', ['idea', 'tip', 'insight', 'desk', 'desk'], [line('M2.5 8.5h14M4 8.7V18M15 8.7V18'), body(R(9.5, 9, 5, 4, 0.6)), line('M11 11h2'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('office-chair-bulb', 'Office Chair Ideas', ['idea', 'tip', 'insight', 'office chair', 'office-chair'], [body(R(6, 3, 7, 7.5, 2)), body(R(4.5, 11, 10, 2.5, 1)), line('M9.5 13.7v2.5M6 18l3.5-1.8L13 18'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('business-card-bulb', 'Business Card Ideas', ['idea', 'tip', 'insight', 'business card', 'business-card'], [body(R(2.5, 5, 14, 10, 1.5)), line(C(6.5, 9, 1.5)), line('M4.5 13a2 2 0 0 1 4 0M10.5 8.5h4M10.5 11h3'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('signature-filter', 'Filter Signature', ['filter', 'sort', 'refine', 'signature', 'signature'], [line('M3.5 13c2-5 4-7 5-6s-2 6-.5 6.5 3-3 4-2.5 1 2 3.5 1.5'), line('M3.5 16.5h12'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
