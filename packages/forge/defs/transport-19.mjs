import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('car-search', 'Find a Car', ['car search', 'vehicle lookup', 'dealership', 'browse cars', 'car'], [body(poly([[3, 14.5], [3, 11.2], [5.2, 6.5], [13.3, 6.5], [16, 11.2], [16, 14.5]], 1, true)), line('M3.2 11h12.6'), body(C(6.5, 15.5, 1.8), { cover: true }), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('car-gear', 'Car Service', ['vehicle maintenance', 'garage', 'repair', 'car settings', 'car'], [body(poly([[3, 14.5], [3, 11.2], [5.2, 6.5], [13.3, 6.5], [16, 11.2], [16, 14.5]], 1, true)), line('M3.2 11h12.6'), body(C(6.5, 15.5, 1.8), { cover: true }), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('car-lock', 'Car Lock', ['lock car', 'central locking', 'vehicle security', 'anti theft', 'car'], [body(poly([[3, 14.5], [3, 11.2], [5.2, 6.5], [13.3, 6.5], [16, 11.2], [16, 14.5]], 1, true)), line('M3.2 11h12.6'), body(C(6.5, 15.5, 1.8), { cover: true }), body(R(13.8, 15, 7, 6, 1.5), { cover: true }), line('M15.3 15v-1.5a2 2 0 0 1 4 0V15')], { noAccent: true }),
    icon('car-heart', 'Saved Cars', ['favourite cars', 'wishlist', 'liked vehicles', 'garage', 'car'], [body(poly([[3, 14.5], [3, 11.2], [5.2, 6.5], [13.3, 6.5], [16, 11.2], [16, 14.5]], 1, true)), line('M3.2 11h12.6'), body(C(6.5, 15.5, 1.8), { cover: true }), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('car-star', 'Top Rated Car', ['featured car', 'best seller', 'review', 'vehicle', 'car'], [body(poly([[3, 14.5], [3, 11.2], [5.2, 6.5], [13.3, 6.5], [16, 11.2], [16, 14.5]], 1, true)), line('M3.2 11h12.6'), body(C(6.5, 15.5, 1.8), { cover: true }), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
