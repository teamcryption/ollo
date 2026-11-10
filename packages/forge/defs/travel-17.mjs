import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('airplane-heart', 'Saved Flights', ['favourite flights', 'wishlist', 'travel', 'trips', 'airplane'], [body('M9.5 3.5c.8 0 1.2.8 1.2 1.8V9l5 3v1.8l-5-1.5v3.5l1.8 1.4V19l-3-.9-3 .9v-1.8l1.8-1.4v-3.5l-5 1.5V12l5-3V5.3c0-1 .4-1.8 1.2-1.8Z'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('airplane-star', 'Top Flight', ['best airline', 'rated flight', 'premium', 'travel', 'airplane'], [body('M9.5 3.5c.8 0 1.2.8 1.2 1.8V9l5 3v1.8l-5-1.5v3.5l1.8 1.4V19l-3-.9-3 .9v-1.8l1.8-1.4v-3.5l-5 1.5V12l5-3V5.3c0-1 .4-1.8 1.2-1.8Z'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('airplane-gear', 'Flight Settings', ['flight preferences', 'booking options', 'travel settings', 'configure', 'airplane'], [body('M9.5 3.5c.8 0 1.2.8 1.2 1.8V9l5 3v1.8l-5-1.5v3.5l1.8 1.4V19l-3-.9-3 .9v-1.8l1.8-1.4v-3.5l-5 1.5V12l5-3V5.3c0-1 .4-1.8 1.2-1.8Z'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
  ],
};
