import { R, C, L, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('police-car', 'Police Car', ['police', 'patrol', 'cop', 'emergency', 'law'], [body(R(10.5, 3.5, 3, 2.5, 0.8)), line('M8.3 4.3 7 3.6M15.7 4.3l1.3-.7'), body(R(3.5, 10, 17, 7, 2)), line('M5.5 10 7 6h10l1.5 4'), line(L(6, 17.2, 6, 19.5)), line(L(18, 17.2, 18, 19.5)), line(D(7, 13.5)), line(D(17, 13.5)), accent(L(10.5, 13.5, 13.5, 13.5))]),
    icon('fire-truck', 'Fire Truck', ['fire engine', 'firefighter', 'emergency', 'rescue', 'ladder'], [line('M3.5 6.5h10M3.5 4.5h10M5.5 4.5v2M8.5 4.5v2M11.5 4.5v2'), body(R(3, 9, 11, 8.5, 1.5)), body('M14 11h3.5l3 3v3.5H14Z'), body(C(7, 18.5, 1.8), { cover: true }), body(C(17, 18.5, 1.8), { cover: true })], { noAccent: true }),
    icon('tow-truck', 'Tow Truck', ['towing', 'breakdown', 'roadside', 'recovery', 'wrecker'], [line('M9 14 4.5 7.5v3M4.5 10.5a1.3 1.3 0 1 0 1.3 1.3'), body(R(3.5, 14, 8.5, 3.5, 1)), body('M12 8.5h4a1.5 1.5 0 0 1 1.3.8l2.5 4.2a1.5 1.5 0 0 1 .2.7v3.3H12Z'), body(C(7, 18.5, 1.8), { cover: true }), body(C(16.5, 18.5, 1.8), { cover: true })], { noAccent: true }),
  ],
};
