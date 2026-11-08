import { C, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { CORNERS } from './security.mjs';


export default {
  category: 'security',
  icons: [
    icon('incognito', 'Incognito', ['private', 'anonymous', 'spy', 'hidden', 'privacy'], [line('M3.5 11h17'), body('M6.5 11 8 5.5a1.5 1.5 0 0 1 2-1l2 .8 2-.8a1.5 1.5 0 0 1 2 1l1.5 5.5Z'), line(C(8, 16, 2.5) + C(16, 16, 2.5)), line('M10.5 16a1.5 1.5 0 0 1 3 0')], { noAccent: true }),
    icon('face-scan', 'Face Scan', ['face id', 'biometric', 'recognition', 'unlock', 'identity'], [...CORNERS, line(D(9.5, 10) + D(14.5, 10)), accent('M9 14a4 4 0 0 0 6 0')]),
  ],
};
