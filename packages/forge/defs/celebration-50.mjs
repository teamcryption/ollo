import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('skull-pricing', 'Skull Pricing', ['pricing', 'cost', 'money', 'skull', 'skull'], [body('M9.5 3.5a6 6 0 0 1 6 6c0 2-1 3.3-2 4V16a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.5c-1-.7-2-2-2-4a6 6 0 0 1 6-6Z'), line(C(7.2, 9.6, 1.2) + C(11.8, 9.6, 1.2)), line('M8 14.5V16M11 14.5V16'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
  ],
};
