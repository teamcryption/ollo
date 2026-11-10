import { icon, body, line } from '../src/dsl.mjs';
import { R, C, rotateD } from '../src/geo.mjs';

const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];

export default {
  category: 'logistics',
  icons: [
    icon('parcel-clock', 'Delivery Window', ['delivery time', 'eta', 'scheduled delivery', 'time slot', 'courier'], [body(R(3, 4, 12.5, 12, 2)), line('M9.25 4.2v3.5'), ...CLOCK], { noAccent: true }),
  ],
};
