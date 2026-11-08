import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('crane-hook', 'Crane Hook', ['hook', 'lift', 'hoist', 'cargo', 'construction'], [line('M12 3v3.5'), body(R(8.5, 6.5, 7, 5, 1.2)), line('M12 11.5v5a3 3 0 1 1-5.2-2')], { noAccent: true }),
  ],
};
