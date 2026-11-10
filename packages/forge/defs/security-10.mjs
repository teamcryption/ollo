import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'security',
  icons: [
    icon('motion-sensor', 'Motion Sensor', ['pir sensor', 'detector', 'alarm', 'smart home', 'movement'], [body(R(8, 3.5, 8, 4, 1)), body('M7.5 8h9a4.5 4.5 0 0 1-9 0Z'), accent('M7 16.5q5 3 10 0M9 19.5q3 1.5 6 0')]),
    icon('keypad', 'Keypad', ['pin pad', 'door code', 'entry', 'passcode', 'access'], [body(R(5, 3.5, 14, 17, 2.5)), line('M8.5 7h7'), line(D(8.5, 11) + D(12, 11) + D(15.5, 11) + D(8.5, 14) + D(12, 14) + D(15.5, 14) + D(8.5, 17) + D(12, 17) + D(15.5, 17))], { noAccent: true }),
  ],
};
