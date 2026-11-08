import { L } from '../src/geo.mjs';
import { icon, line } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('coat-rack', 'Coat Rack', ['coat stand', 'hanger', 'hallway', 'entrance', 'hooks'], [line(L(12, 3.5, 12, 18.5)), line('M12 6.5 8.5 4.5M12 6.5l3.5-2M12 10 8.5 8M12 10l3.5-2M8 20.5l4-2.5 4 2.5')], { noAccent: true }),
  ],
};
