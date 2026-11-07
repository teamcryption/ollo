import { R, C, L, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { SHIELD, CORNERS } from './security.mjs';

export default {
  category: 'security',
  icons: [
    icon('shield-lock', 'Shield Lock', ['secure', 'protected', 'encryption', 'privacy'], [body(SHIELD), line('M10.5 11.5v-1a1.5 1.5 0 0 1 3 0v1'), body(R(9.5, 11.5, 5, 4, 1))], { noAccent: true }),
    icon('scan-face', 'Face Scan', ['face id', 'biometric', 'recognition', 'unlock'], [...CORNERS, line(D(9.5, 10)), line(D(14.5, 10)), accent('M9.5 14.5a3.5 3.5 0 0 0 5 0')]),
    icon('incognito', 'Incognito', ['private', 'anonymous', 'spy', 'hidden'], [body(poly6()), line(L(3.5, 10.5, 20.5, 10.5)), line(C(8, 16, 2.8)), line(C(16, 16, 2.8)), line('M10.8 16h2.4')], { noAccent: true }),
    icon('firewall', 'Firewall', ['wall', 'block', 'network security', 'protection'], [body(R(3.5, 4.5, 17, 15, 2)), line(L(3.7, 9.5, 20.3, 9.5)), line(L(3.7, 14.5, 20.3, 14.5)), line(L(9, 4.7, 9, 9.3)), line(L(15, 4.7, 15, 9.3)), line(L(12, 9.7, 12, 14.3)), line(L(9, 14.7, 9, 19.3)), line(L(15, 14.7, 15, 19.3))], { noAccent: true }),
  ],
};
function poly6() { return 'M6.4 9.5 7.8 5.3A1.2 1.2 0 0 1 9 4.5h6a1.2 1.2 0 0 1 1.2.8l1.4 4.2Z'; }
