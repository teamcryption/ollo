import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const HEAD = body('M12 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z');
const TORSO = body('M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z');

export default {
  category: 'people',
  icons: [
    icon('user-tie', 'Professional', ['business person', 'employee', 'manager', 'formal'], [HEAD, TORSO, line(poly([[11.2, 15.6], [12.8, 15.6], [13.1, 17.3], [12, 18.4], [10.9, 17.3]], 0.2, true))], { noAccent: true }),
    icon('user-headset', 'Support Agent', ['customer service', 'help desk', 'call centre', 'agent'], [HEAD, TORSO, line(A(12, 8, 5.5, 180, 360)), line('M17.5 8.5v1.5a2.5 2.5 0 0 1-2.5 2.5h-1.2')], { noAccent: true }),
    icon('user-search', 'Find People', ['search users', 'lookup', 'directory', 'recruit'], [HEAD, TORSO, body(C(16.5, 16, 3), { cover: true }), line(L(18.7, 18.2, 20.5, 20))], { noAccent: true }),
    icon('baby', 'Baby', ['infant', 'child', 'newborn', 'toddler'], [body(C(12, 13, 7.5)), line('M12 5.5c-1.5 0-2.2-1.3-1.3-2.2'), line(D(9.5, 12.5)), line(D(14.5, 12.5)), accent(C(12, 16.3, 1.2))]),
    icon('family', 'Family', ['parent', 'child', 'household', 'kids'], [body(C(8.5, 6, 2.3)), body('M4.5 20.5v-6a4 4 0 0 1 8 0v6'), accent(C(16.5, 10.5, 1.8)), body('M13.5 20.5v-3a3 3 0 0 1 6 0v3')]),
  ],
};
