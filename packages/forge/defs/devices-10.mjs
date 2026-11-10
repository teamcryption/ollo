import { icon, body, line } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

const KEYS = [];
for (const y of [3.5, 8.3, 13.1]) for (const x of [5, 10.25, 15.5]) KEYS.push(body(R(x, y, 3.5, 3.3, 0.8)));

export default {
  category: 'devices',
  icons: [
    icon('hdmi-cable', 'HDMI Cable', ['hdmi', 'video cable', 'connector', 'display', 'port'], [body(poly([[6.5, 3.5], [17.5, 3.5], [17.5, 7.5], [15.5, 10], [8.5, 10], [6.5, 7.5]], 1, true)), body(R(8.5, 10, 7, 4.5, 1)), line('M12 14.5v6')], { noAccent: true }),
    icon('numpad', 'Numpad', ['number keys', 'keypad', 'dial pad', 'pin entry', 'keyboard'], [...KEYS, body(R(5, 17.9, 8.75, 3.1, 0.8)), body(R(15.5, 17.9, 3.5, 3.1, 0.8))], { noAccent: true }),
  ],
};
