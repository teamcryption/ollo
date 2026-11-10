import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('gift-clock', 'Scheduled Gift', ['send later', 'gift delivery date', 'surprise', 'present', 'gift'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('gift-star', 'Top Gift', ['best gift', 'popular present', 'featured', 'gift idea', 'gift'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('gift-pin', 'Gift Delivery', ['gift address', 'send to', 'delivery location', 'present', 'gift'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
