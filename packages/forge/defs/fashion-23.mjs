import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('shirt-heart', 'Fashion Wishlist', ['saved clothes', 'liked outfit', 'style', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('shirt-search', 'Find Clothes', ['clothing search', 'browse fashion', 'shop', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
