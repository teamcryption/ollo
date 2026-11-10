import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('headphones-shield', 'Headphones Protection', ['protected', 'secure', 'safety', 'headphones', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('tv-shield', 'TV Protection', ['protected', 'secure', 'safety', 'tv', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('film-shield', 'Film Protection', ['protected', 'secure', 'safety', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('film-gear', 'Film Settings', ['settings', 'configure', 'preferences', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('headphones-pin', 'Headphones Location', ['location', 'place', 'map', 'headphones', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('tv-pin', 'TV Location', ['location', 'place', 'map', 'tv', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('mic-pin', 'Mic Location', ['location', 'place', 'map', 'mic', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('tv-bolt', 'Instant TV', ['quick', 'fast', 'instant', 'tv', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('mic-bolt', 'Instant Mic', ['quick', 'fast', 'instant', 'mic', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('film-bolt', 'Instant Film', ['quick', 'fast', 'instant', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('mic-heart', 'Favourite Mic', ['favourite', 'saved', 'like', 'mic', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
  ],
};
