import { icon, body, line } from '../src/dsl.mjs';
import { C, rotateD } from '../src/geo.mjs';

const BLADE = 'M12 8c-.7-2.6.4-4.3 2.6-4.5.6 2.2-.5 4-2.6 4.5Z';

export default {
  category: 'home',
  icons: [
    icon('desk-fan', 'Desk Fan', ['fan', 'cooling', 'summer', 'breeze', 'air'], [line(C(12, 9, 6)), ...[0, 120, 240].map((a) => body(rotateD(BLADE, a, 12, 9))), body(C(12, 9, 1.2)), line('M12 15v5.5M8.5 20.5h7')], { noAccent: true, anim: 'spin' }),
  ],
};
