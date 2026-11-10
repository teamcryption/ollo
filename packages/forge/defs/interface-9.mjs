import { icon, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'interface',
  icons: [
    icon('resize-corner', 'Resize Handle', ['resize', 'drag corner', 'textarea', 'scale', 'handle'], [line(R(3.5, 3.5, 17, 17, 2.5)), line('M18 12.5 12.5 18M18 16.5 16.5 18')], { noAccent: true }),
  ],
};
