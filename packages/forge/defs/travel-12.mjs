import { icon, body, line } from '../src/dsl.mjs';
import { R, E, rotateD } from '../src/geo.mjs';

export default {
  category: 'travel',
  icons: [
    icon('kayak-paddle', 'Kayak Paddle', ['paddle', 'kayaking', 'canoeing', 'rowing', 'water sport'], [line('M7.5 16.5 16.5 7.5'), body(rotateD(E(5.6, 18.4, 3, 1.7), -45, 5.6, 18.4)), body(rotateD(E(18.4, 5.6, 3, 1.7), -45, 18.4, 5.6))], { noAccent: true }),
  ],
};
