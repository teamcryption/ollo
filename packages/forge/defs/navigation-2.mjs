import { R, C, L, A, poly, D, scaleD, translateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const PIN = 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z';
const octagon = Array.from({ length: 8 }, (_, i) => {
  const a = ((22.5 + i * 45) * Math.PI) / 180;
  return [12 + 6.8 * Math.cos(a), 9.8 + 6.8 * Math.sin(a)];
});

export default {
  category: 'navigation',
  icons: [
    icon('road', 'Road', ['street', 'highway', 'lane', 'drive', 'route'], [line(L(7, 3.5, 4, 20.5)), line(L(17, 3.5, 20, 20.5)), line(L(12, 4, 12, 7)), accent(L(12, 10.5, 12, 13.5)), line(L(12, 17, 12, 20.5))], { anim: { preset: 'bounce', dist: 1 } }),
    icon('elevation', 'Elevation', ['altitude', 'profile', 'climb', 'hiking', 'height'], [line(L(3.5, 20.5, 20.5, 20.5)), line(poly([[3.5, 17], [8, 10], [11.5, 13.5], [15.5, 6], [20.5, 12]], 0.8)), accent(D(15.5, 3))]),
    icon('trail', 'Trail', ['path', 'hike', 'track', 'journey', 'trek'], [accent(C(4.8, 19.3, 1.3)), line(D(8, 17.5)), line(D(11, 16.3)), line(D(13.5, 14.5)), line(D(15.2, 12.2)), line(L(17, 3.5, 17, 10.5)), body(poly([[17, 4], [20.5, 5.6], [17, 7.2]], 0.4, true))]),
    icon('flag-finish', 'Finish Flag', ['finish line', 'race', 'checkered', 'goal', 'complete'], [line(L(5, 21, 5, 4)), body(R(7.5, 4.5, 12, 8, 1.2)), line(L(11.5, 4.7, 11.5, 12.3)), line(L(15.5, 4.7, 15.5, 12.3)), line(L(7.7, 8.5, 19.3, 8.5))], { noAccent: true, anim: 'wiggle' }),
    icon('street-lamp', 'Street Lamp', ['streetlight', 'lamp post', 'lighting', 'city'], [line('M7 21V6a2.5 2.5 0 0 1 2.5-2.5H14'), body('M12.5 3.5h4l1.5 3h-7Z'), accent(L(14.5, 9, 14.5, 11)), line(L(4.5, 21, 9.5, 21))]),
    icon('pins', 'Locations', ['places', 'multiple locations', 'markers', 'stores', 'branches'], [line(translateD(scaleD(PIN, 0.72), 4, -2.3)), body(translateD(scaleD(PIN, 0.72), -3.2, 2), { cover: true }), accent(C(8.8, 12.56, 1.7))]),
    icon('stop-sign', 'Stop Sign', ['stop', 'halt', 'traffic', 'road sign', 'end'], [body(poly(octagon, 1, true)), accent(L(9.5, 9.8, 14.5, 9.8)), line(L(12, 16.8, 12, 21))]),
  ],
};
