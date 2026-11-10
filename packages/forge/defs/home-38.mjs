import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('fridge-gear', 'Fridge Settings', ['temperature settings', 'smart fridge', 'configure', 'kitchen', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('washer-gear', 'Wash Programs', ['laundry settings', 'cycle options', 'configure', 'laundry', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('washer-bolt', 'Quick Wash', ['express cycle', 'fast laundry', '15 minute wash', 'laundry', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('oven-gear', 'Oven Settings', ['temperature', 'cooking mode', 'configure', 'kitchen', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('sofa-heart', 'Favourite Furniture', ['saved furniture', 'wishlist', 'living room', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('sofa-pin', 'Furniture Store', ['furniture shop location', 'showroom', 'map', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('sofa-search', 'Find Furniture', ['furniture search', 'browse sofas', 'shop', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
