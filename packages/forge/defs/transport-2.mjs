import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('motorcycle', 'Motorcycle', ['motorbike', 'bike', 'rider', 'delivery'], [body(C(5.5, 16.5, 3)), body(C(18.5, 16.5, 3)), body(R(8, 10.5, 8, 4.5, 2)), line(L(5.5, 16.5, 8.5, 14.5)), line(L(18.5, 16.5, 15.5, 14.5)), line('M15.5 10.5 14.5 6.5H17'), accent(L(3.5, 10.5, 5.5, 10.5))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('kick-scooter', 'Scooter', ['kick scooter', 'micromobility', 'ride', 'e-scooter'], [body(C(5.5, 18, 2.2)), body(C(18.5, 18, 2.2)), line(L(7.7, 18, 16.3, 18)), line(L(18.5, 15.8, 15.5, 4)), line(L(13.5, 4, 17.5, 4))], { noAccent: true, anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('taxi', 'Taxi', ['cab', 'ride', 'hail', 'car', 'uber'], [line(R(9.5, 3, 5, 2, 0.6)), body(R(3.5, 10, 17, 7, 2)), line('M5.5 10 7 6h10l1.5 4'), line(L(6, 17.2, 6, 19.5)), line(L(18, 17.2, 18, 19.5)), line(D(7, 13.5)), line(D(17, 13.5)), accent(L(10.5, 13.5, 13.5, 13.5))]),
    icon('tram', 'Tram', ['streetcar', 'trolley', 'light rail', 'metro'], [line('M9 3.5h6M12 3.5V6'), body(R(5, 6, 14, 12, 3)), line(L(5.2, 10.5, 18.8, 10.5)), line(L(8, 18.2, 6.5, 20.5)), line(L(16, 18.2, 17.5, 20.5)), accent(D(8.5, 14.5)), line(D(15.5, 14.5))]),
    icon('helicopter', 'Helicopter', ['chopper', 'rescue', 'aviation', 'flight'], [line(L(3.5, 6, 20.5, 6)), line(L(11, 6, 11, 10)), body('M5 10h8.5a4.5 4.5 0 0 1 0 9H8a3 3 0 0 1-3-3Z'), line(L(18, 13, 21, 11)), line(L(7, 21, 16, 21)), accent(D(14.5, 13.5))]),
    icon('sailboat', 'Sailboat', ['yacht', 'sailing', 'boat', 'regatta', 'sea'], [body('M3.5 16h17l-2.5 4.5H6Z'), line(L(12, 3.5, 12, 16)), body(poly([[13.5, 4.5], [19, 14], [13.5, 14]], 0.6, true)), line(poly([[10.5, 6.5], [10.5, 14], [5.5, 14]], 0.6, true))], { noAccent: true, anim: 'wiggle' }),
    icon('cable-car', 'Cable Car', ['gondola', 'ski lift', 'aerial tram', 'mountain'], [line(L(3, 4.5, 21, 8.5)), line(L(12, 6.5, 12, 9.5)), body(R(6, 9.5, 12, 10, 2.5)), line(L(6.2, 13.5, 17.8, 13.5)), accent(D(12, 17))]),
  ],
};
