import { C } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('van', 'Van', ['minivan', 'delivery van', 'camper', 'vehicle', 'transporter'], [body('M3.5 16.5V8A2 2 0 0 1 5.5 6h9.5l4 4.5a2.5 2.5 0 0 1 1.5 2.3v3.7Z'), line('M14.5 6.2V10.5H19'), body(C(7.5, 17.5, 2), { cover: true }), body(C(16.5, 17.5, 2), { cover: true }), accent('M7 9.5h4')], { anim: { preset: 'nudge', dir: [1, 0], dist: 1 } }),
  ],
};
