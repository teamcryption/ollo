import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('megaphone-clock', 'Scheduled Announcement', ['planned campaign', 'broadcast time', 'marketing', 'announce', 'megaphone'], [body('M3 8.5h3l7.5-4v12L6 12.5H3Z'), line('M5 12.5l1 3.5'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('megaphone-star', 'Featured Announcement', ['promoted', 'highlight', 'campaign', 'announce', 'megaphone'], [body('M3 8.5h3l7.5-4v12L6 12.5H3Z'), line('M5 12.5l1 3.5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('megaphone-pin', 'Local Ad', ['local campaign', 'geo targeted', 'marketing', 'announce', 'megaphone'], [body('M3 8.5h3l7.5-4v12L6 12.5H3Z'), line('M5 12.5l1 3.5'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
