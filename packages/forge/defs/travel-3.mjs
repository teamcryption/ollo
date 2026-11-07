import { R, C, L, A, poly, D, rotateD, scaleD, translateD, mirrorD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const PLANE = 'M12 3c.8 0 1.5 1 1.5 2.5V9l6.5 4v2l-6.5-2v4l2 1.5V20l-3.5-1-3.5 1v-1.5l2-1.5v-4L4 15v-2l6.5-4V5.5C10.5 4 11.2 3 12 3Z';
const LENS = 'M3 9h7.5v2.5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z';
const buoy = [45, 135, 225, 315].map((a) => {
  const t = (a * Math.PI) / 180;
  return line(L(12 + 4.2 * Math.cos(t), 12 + 4.2 * Math.sin(t), 12 + 8.3 * Math.cos(t), 12 + 8.3 * Math.sin(t)));
});

export default {
  category: 'travel',
  icons: [
    icon('camper-van', 'Camper Van', ['rv', 'motorhome', 'road trip', 'camping'], [body('M3 16V8a2 2 0 0 1 2-2h10l4.5 5v5Z'), body(C(7, 17, 2), { cover: true }), body(C(16.5, 17, 2), { cover: true }), line(R(5.5, 8.5, 4, 3, 0.6)), accent(L(12.5, 8.5, 12.5, 12))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('boarding-pass', 'Boarding Pass', ['flight ticket', 'airline', 'check-in', 'gate'], [body(R(3, 6, 18, 12, 2)), line(L(15, 6.2, 15, 17.8)), accent(translateD(rotateD(scaleD(PLANE, 0.4), 90), -3, 0)), line(L(17, 10, 19, 10)), line(L(17, 13, 19, 13))]),
    icon('hiking-boot', 'Hiking Boot', ['hike', 'trek', 'outdoor', 'walking boot'], [body('M5 3.5h6v6l6.5 2.5a3 3 0 0 1 2 2.8V18H5Z'), line(L(4.5, 20.5, 19.5, 20.5)), line(L(8.5, 7, 11, 7)), line(L(8.5, 10.5, 11, 10.5))], { noAccent: true }),
    icon('life-buoy', 'Life Buoy', ['lifebuoy', 'rescue', 'support', 'safety', 'help'], [body(C(12, 12, 8.5)), line(C(12, 12, 4)), ...buoy], { noAccent: true }),
    icon('sunglasses', 'Sunglasses', ['shades', 'summer', 'beach', 'cool'], [body(LENS), body(mirrorD(LENS)), line('M10.5 10a2 2 0 0 1 3 0')], { noAccent: true }),
    icon('luggage-cart', 'Luggage Cart', ['baggage trolley', 'airport', 'cart', 'porter'], [line('M4 4h2.5L9 17h10'), body(C(10, 19.3, 1.4)), body(C(17, 19.3, 1.4)), line('M12.5 8V6.5h3V8'), body(R(10, 8, 8, 7, 1.5))], { noAccent: true }),
  ],
};
