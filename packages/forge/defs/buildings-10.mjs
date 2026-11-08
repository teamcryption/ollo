import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('brick-wall', 'Brick Wall', ['bricks', 'wall', 'masonry', 'construction', 'barrier'], [body(R(3.5, 5, 17, 14, 1.5)), line('M3.5 9.7h17M3.5 14.3h17M9 5v4.7M15 5v4.7M12 9.7v4.6M9 14.3V19M15 14.3V19')], { noAccent: true }),
  ],
};
