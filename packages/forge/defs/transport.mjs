import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('car', 'Car', ['vehicle', 'auto', 'drive', 'taxi', 'ride'], [body(R(3.5, 10, 17, 7, 2)), line('M5.5 10 7 6h10l1.5 4'), line(L(6, 17.2, 6, 19.5)), line(L(18, 17.2, 18, 19.5)), line(D(7, 13.5)), line(D(17, 13.5)), accent(L(10.5, 13.5, 13.5, 13.5))], { anim: { preset: 'bounce', dist: -1 } }),
    icon('bus', 'Bus', ['transit', 'public transport', 'coach', 'commute'], [body(R(5, 3.5, 14, 15, 2.5)), line(L(5.2, 7, 18.8, 7)), line(L(5.2, 12, 18.8, 12)), line(D(8, 15)), line(D(16, 15)), line(L(8, 18.7, 8, 20.5)), line(L(16, 18.7, 16, 20.5)), accent(L(10.5, 15, 13.5, 15))]),
    icon('train', 'Train', ['rail', 'metro', 'subway', 'transit', 'railway'], [body(R(6, 3.5, 12, 14, 3.5)), line(L(6.2, 10.5, 17.8, 10.5)), line(D(9, 14)), line(D(15, 14)), line(L(8.5, 17.8, 6.5, 20.5)), line(L(15.5, 17.8, 17.5, 20.5)), accent(L(10.5, 6.5, 13.5, 6.5))]),
    icon('bicycle', 'Bicycle', ['bike', 'cycling', 'ride', 'cycle'], [line(C(6, 15.5, 3.5)), line(C(18, 15.5, 3.5)), line('M6 15.5 9 9h6l3 6.5'), line('M9 9l3.5 6.5L15 9'), accent(L(7, 6.5, 9.5, 6.5))]),
    icon('ship', 'Ship', ['boat', 'ferry', 'cruise', 'sea', 'shipping'], [body('M3.5 14.5h17l-2 4.5a2 2 0 0 1-1.8 1H7.3a2 2 0 0 1-1.8-1Z'), line('M6 14.5V10h12v4.5'), line(L(12, 10, 12, 4.5)), line(poly([[12, 4.5], [15.5, 6], [12, 7.5]], 0.4)), accent(D(9, 12.2))], { anim: 'wiggle' }),
    icon('fuel', 'Fuel', ['gas', 'petrol', 'pump', 'station', 'refuel'], [body(R(4, 4, 10, 16.5, 2)), line(R(6.5, 6.5, 5, 4, 1)), line('M14 9h2a2 2 0 0 1 2 2v5.5a1.5 1.5 0 0 0 3 0V8l-2.5-2.5'), accent(L(7.5, 15.5, 10.5, 15.5))]),
    icon('traffic-light', 'Traffic Light', ['signal', 'stop', 'go', 'road', 'intersection'], [body(R(8, 3, 8, 18, 3)), line(C(12, 7.5, 1.3)), line(C(12, 12, 1.3)), accent(C(12, 16.5, 1.3))]),
    icon('steering-wheel', 'Steering Wheel', ['drive', 'driver', 'control', 'car'], [body(C(12, 12, 8.5)), line(C(12, 12, 2.2)), line(L(3.6, 12, 9.8, 12)), line(L(14.2, 12, 20.4, 12)), line(L(12, 14.2, 12, 20.4))], { noAccent: true, anim: 'wiggle' }),
  ],
};
