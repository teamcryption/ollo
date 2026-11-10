import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'home',
  icons: [
    icon('key-ring', 'Key Ring', ['keychain', 'keys', 'key fob', 'house keys', 'access'], [line(C(8, 8, 4.5)), body(C(13, 13, 2.8), { cover: true }), line('M15 15l5.5 5.5M17.6 17.6l1.6-1.6M19.3 19.3l1.2-1.2')], { noAccent: true }),
    icon('window-blinds', 'Window Blinds', ['blinds', 'shades', 'window', 'privacy', 'interior'], [line('M3 3.5h18'), body(R(4.5, 3.5, 15, 11, 1)), line('M4.5 7.2h15M4.5 10.8h15'), line('M4.5 14.5v6h15v-6'), line('M16.5 14.5v3')], { noAccent: true }),
  ],
};
