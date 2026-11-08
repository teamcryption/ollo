import { C, L } from '../src/geo.mjs';
import { icon, body, accent } from '../src/dsl.mjs';

const USER = [body('M12 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z'), body('M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z')];
const withGlyph = (g) => [...USER, body(C(17, 17, 4), { cover: true, badge: true }), accent(g, { badge: true })];

export default {
  category: 'people',
  icons: [
    icon('user-clock', 'User Clock', ['attendance', 'shift', 'time tracking', 'pending', 'profile'], withGlyph('M17 15v2l1.3 1.2')),
    icon('user-key', 'User Key', ['access', 'credentials', 'permission', 'login', 'profile'], withGlyph(C(15.6, 17, 1.1) + L(16.7, 17, 19, 17) + L(18.3, 17, 18.3, 18.2))),
  ],
};
