import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('makeup-brush', 'Makeup Brush', ['blush brush', 'cosmetics', 'beauty', 'powder', 'makeup'], [...rot([body('M9 4c0-.5 6-.5 6 0l-.5 5h-5Z'), body(R(9.5, 10, 5, 2.5, 0.5)), body('M10.5 13.5h3l-.5 7h-2Z')], 30)], { noAccent: true }),
    icon('face-cream', 'Face Cream', ['moisturiser', 'skincare', 'jar', 'beauty', 'lotion'], [body(R(5, 7, 14, 3.5, 1.2)), body(R(5.5, 11.5, 13, 8.5, 2.5)), line('M8.5 15.5h7')], { noAccent: true }),
    icon('serum-bottle', 'Serum Bottle', ['dropper bottle', 'skincare', 'essential oil', 'beauty', 'serum'], [body(E(12, 4.8, 1.8, 1.3)), body(R(9.5, 7, 5, 2.5, 0.8)), body(R(7.5, 10.5, 9, 10, 2.5))], { noAccent: true }),
    icon('barber-pole', 'Barber Pole', ['barbershop', 'haircut', 'salon', 'grooming', 'barber'], [body(R(8, 3.5, 8, 1.8, 0.9)), body(R(9, 6.3, 6, 11.4, 1)), line('M9.2 10l5.6-2.5M9.2 13.5l5.6-2.5M9.2 17l5.6-2.5'), body(R(8, 18.7, 8, 1.8, 0.9))], { noAccent: true }),
  ],
};
