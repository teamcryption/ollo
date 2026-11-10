import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('headphones-heart', 'Favourite Audio', ['liked tracks', 'saved audio', 'music', 'headphones', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('headphones-bolt', 'Headphones Charging', ['charge headset', 'battery', 'power', 'audio', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('headphones-search', 'Find My Headphones', ['locate earbuds', 'lost headphones', 'search', 'audio', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('tv-search', 'Find Shows', ['search tv', 'browse channels', 'streaming', 'television', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('tv-clock', 'TV Schedule', ['programme guide', 'airtime', 'listings', 'television', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('tv-heart', 'Favourite Shows', ['watchlist', 'liked series', 'streaming', 'television', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('tv-lock', 'Parental Lock', ['child lock', 'restricted channels', 'kids safety', 'television', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('tv-gear', 'TV Settings', ['display settings', 'picture mode', 'configure', 'television', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
  ],
};
