import { R, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'tools',
  icons: [
    icon('screw', 'Screw', ['fastener', 'bolt', 'hardware', 'fix', 'diy'], [body(R(7.5, 3.5, 9, 3, 1.2)), body(poly([[9.5, 6.5], [14.5, 6.5], [14.5, 16], [12, 20.5], [9.5, 16]], 0.5, true)), line('M9.7 10l4.6-1.2M9.7 13l4.6-1.2M9.7 16l4.6-1.2')], { noAccent: true }),
  ],
};
