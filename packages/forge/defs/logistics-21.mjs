import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'logistics',
  icons: [
    icon('ship-search', 'Track Vessel', ['ship tracking', 'marine traffic', 'cargo', 'boat', 'ship'], [line('M9.5 12V4.5l4.5 5.5H9.5'), body('M3 12h13l-1.8 4.2H4.8Z'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('ship-shield', 'Marine Insurance', ['cargo cover', 'insured shipment', 'boat', 'protection', 'ship'], [line('M9.5 12V4.5l4.5 5.5H9.5'), body('M3 12h13l-1.8 4.2H4.8Z'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
