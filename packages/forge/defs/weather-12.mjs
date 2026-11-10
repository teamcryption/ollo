import { icon, body, line } from '../src/dsl.mjs';
import { C } from '../src/geo.mjs';

export default {
  category: 'weather',
  icons: [
    icon('haze', 'Haze', ['hazy', 'mist', 'smog', 'low visibility', 'dusty'], [body('M7 12a5 5 0 0 1 10 0Z'), line('M12 3.5V5M5.6 6.1l1 1M18.4 6.1l-1 1'), line('M3.5 15.5h17M5.5 19h13')], { noAccent: true }),
    icon('eclipse', 'Eclipse', ['solar eclipse', 'corona', 'astronomy', 'sun and moon', 'totality'], [line('M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4'), body(C(12, 12, 5)), line(C(13, 11, 3.2))], { noAccent: true }),
  ],
};
