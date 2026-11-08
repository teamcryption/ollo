import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, L } from '../src/geo.mjs';

export default {
  category: 'business',
  icons: [
    icon('lanyard', 'Lanyard', ['badge', 'pass', 'conference', 'event', 'staff'], [line('M7.5 3v3a4.5 4.5 0 0 0 9 0V3'), body(R(7, 10, 10, 10.5, 2)), accent(L(9.5, 17.5, 14.5, 17.5))]),
    icon('org-chart', 'Org Chart', ['organization', 'hierarchy', 'team structure', 'reporting', 'company'], [body(R(9, 3.5, 6, 4.5, 1)), line('M12 8v4M6 16v-4h12v4M12 12v4'), body(R(3.5, 16, 5, 4.5, 1)), body(R(9.5, 16, 5, 4.5, 1)), body(R(15.5, 16, 5, 4.5, 1))], { noAccent: true }),
  ],
};
