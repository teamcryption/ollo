import { R, C } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'media',
  icons: [
    icon('livestream', 'Livestream', ['live', 'streaming', 'broadcast', 'on air', 'stream'], [line('M9 20.5h6M12 17v3.5'), body(R(3, 5, 18, 12, 2)), accent(C(7.5, 9.2, 1.3)), line('M11.2 9.2h4.5')]),
  ],
};
