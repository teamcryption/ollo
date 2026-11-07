import { poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('hut', 'Hut', ['cabin', 'shack', 'cottage', 'village', 'thatched'], [body('M5.5 20.5V12h13v8.5Z'), body(poly([[3.5, 12.5], [12, 3.5], [20.5, 12.5]], 0.6, true), { cover: true }), line('M8.5 9.3 7.2 12.3M15.5 9.3l1.3 3M12 6.5v5.5'), line('M10.5 20.5V16h3v4.5')], { noAccent: true }),
  ],
};
