import { R, C, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('clock-tower', 'Clock Tower', ['town hall', 'tower', 'landmark', 'time', 'belfry'], [body(R(8, 7.5, 8, 13, 1)), body(poly([[6.8, 7.5], [12, 3], [17.2, 7.5]], 0.5, true), { cover: true }), line(C(12, 11.8, 2.3)), line('M12 10.8v1l.8.6'), line('M10.5 20.5V17.5h3v3')], { noAccent: true }),
  ],
};
