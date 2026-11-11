import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('airplane-sparkle', 'AI Airplane', ['ai', 'smart', 'magic', 'airplane', 'airplane'], [body('M9.5 3.5c.8 0 1.2.8 1.2 1.8V9l5 3v1.8l-5-1.5v3.5l1.8 1.4V19l-3-.9-3 .9v-1.8l1.8-1.4v-3.5l-5 1.5V12l5-3V5.3c0-1 .4-1.8 1.2-1.8Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('bed-sparkle', 'AI Hotel', ['ai', 'smart', 'magic', 'hotel', 'bed'], [line('M3 17V6M3 13h13v4'), body('M8 8.5h6a2 2 0 0 1 2 2V13H8Z'), body(C(5.5, 10.8, 1.4)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('tent-sparkle', 'AI Tent', ['ai', 'smart', 'magic', 'tent', 'tent'], [body(poly([[9.5, 4], [16, 16.5], [3, 16.5]], 0.8, true)), line('M9.5 10.5v6'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('ship-sparkle', 'AI Ship', ['ai', 'smart', 'magic', 'ship', 'ship'], [line('M9.5 12V4.5l4.5 5.5H9.5'), body('M3 12h13l-1.8 4.2H4.8Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('passport-sparkle', 'AI Passport', ['ai', 'smart', 'magic', 'passport', 'passport'], [body(R(4, 3.5, 11, 14, 1.5)), line(C(9.5, 9, 2.5)), line('M7 14h5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('suitcase-sparkle', 'AI Suitcase', ['ai', 'smart', 'magic', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('anchor-sparkle', 'AI Anchor', ['ai', 'smart', 'magic', 'anchor', 'anchor'], [line(C(9.5, 4.8, 1.4)), line('M9.5 6.2V18M6.5 9h6'), line('M4 13.5c0 2.8 2.5 4.5 5.5 4.5s5.5-1.7 5.5-4.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('backpack-sparkle', 'AI Backpack', ['ai', 'smart', 'magic', 'backpack', 'backpack'], [line('M7.5 5.5V5a2 2 0 0 1 4 0v.5'), body('M4.5 9a3.5 3.5 0 0 1 3.5-3.5h3A3.5 3.5 0 0 1 14.5 9v8a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 17Z'), line('M7.5 12h4v3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('lifebuoy-sparkle', 'AI Lifebuoy', ['ai', 'smart', 'magic', 'lifebuoy', 'lifebuoy'], [body(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 2.8)), line('M5 6l2.4 2.4M14 6l-2.4 2.4M5 15l2.4-2.4'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('sailboat-sparkle', 'AI Sailboat', ['ai', 'smart', 'magic', 'sailboat', 'sailboat'], [body(poly([[9, 3.5], [9, 12], [3.5, 12]], 0.8, true)), body(poly([[10.6, 5.5], [14.8, 12], [10.6, 12]], 0.6, true)), body('M3 14h13l-1.8 3.5H4.8Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('binoculars-sparkle', 'AI Binoculars', ['ai', 'smart', 'magic', 'binoculars', 'binoculars'], [body(R(3.5, 8, 5, 9.5, 2)), body(R(10.5, 8, 5, 9.5, 2)), line('M8.7 10.5h1.6'), line('M4.5 8V5h3v3M11.5 8V5h3v3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('palm-tree-sparkle', 'AI Palm Tree', ['ai', 'smart', 'magic', 'palm tree', 'palm-tree'], [line('M9.5 8.5c.9 3 .9 6.3-.4 9.7'), line('M9.5 8.5C8.5 6 6.5 5 3.5 5.5M9.5 8.5c1-2.5 3-3.5 6-3M9.5 8.5C7.5 8 5.5 9 4.5 11M9.5 8.5c2-.5 4 .5 5 2.5'), line('M4.5 18.5h10'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('campfire-sparkle', 'AI Campfire', ['ai', 'smart', 'magic', 'campfire', 'campfire'], [body('M9.5 3.5c2 2 3.5 3.7 3.5 6a3.5 3.5 0 0 1-7 0c0-1.3.7-2.4 1.6-3.3.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3.2.5-4.6Z'), line('M4 18l11-3.4M4 14.6 15 18'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('hot-air-balloon-sparkle', 'AI Hot Air Balloon', ['ai', 'smart', 'magic', 'hot air balloon', 'hot-air-balloon'], [body('M9.5 3a5.5 5.5 0 0 1 5.5 5.5c0 2.6-2.3 4.5-3.5 6h-4C6.3 13 4 11.1 4 8.5A5.5 5.5 0 0 1 9.5 3Z'), line('M9.5 3.4c-1.6 2.2-1.6 8.8 0 11'), line('M7.6 14.7l.3 1.2M11.4 14.7l-.3 1.2'), body(R(7.5, 16.2, 4, 2.3, 0.6)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('service-bell-sparkle', 'AI Service Bell', ['ai', 'smart', 'magic', 'service bell', 'service-bell'], [body('M3.5 14a6 6 0 0 1 12 0Z'), body(R(2.5, 14, 14, 2.5, 1)), line('M9.5 6V4.5M8 4.5h3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
