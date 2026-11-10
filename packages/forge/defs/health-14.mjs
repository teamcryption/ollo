import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'health',
  icons: [
    icon('stretcher', 'Stretcher', ['gurney', 'ambulance', 'emergency', 'paramedic', 'hospital'], [body(R(5, 7.5, 14, 3, 1.5)), line('M3.5 11.5h17'), line('M7 11.5l10 6M17 11.5l-10 6'), body(C(7, 19, 1.5) + C(17, 19, 1.5))], { noAccent: true }),
    icon('hot-water-bottle', 'Hot Water Bottle', ['warmth', 'heat pack', 'cramps', 'cozy', 'winter'], [body(R(10, 3.5, 4, 2.5, 0.8)), body('M9.5 6h5v2.5h2a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18v-7a2.5 2.5 0 0 1 2.5-2.5h2Z'), line('M8 12.5h8M8 15.5h8')], { noAccent: true }),
    icon('ice-pack', 'Ice Pack', ['cold pack', 'injury', 'swelling', 'first aid', 'cold compress'], [body(R(8, 5, 5, 3.5, 1)), body(R(4, 8.5, 13, 12, 3)), line('M7 14.5h7'), accent('M18.5 3.5v3M17.2 4.25l2.6 1.5M17.2 5.75l2.6-1.5')]),
  ],
};
