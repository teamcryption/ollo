import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('building', 'Office Building', ['office', 'company', 'tower', 'business', 'city'], [body(R(5, 3.5, 10, 17, 1.5)), line('M15 9.5h2.5A1.5 1.5 0 0 1 19 11v9.5'), line(D(8, 7.5)), line(D(12, 7.5)), line(D(8, 11.5)), line(D(12, 11.5)), line(D(8, 15.5)), accent(D(12, 15.5)), line(L(3.5, 20.5, 20.5, 20.5))]),
    icon('hospital', 'Hospital', ['clinic', 'medical', 'emergency', 'health'], [body(R(5, 3.5, 14, 17, 1.5)), accent('M12 6.5v4M10 8.5h4'), line(D(8.5, 14)), line(D(15.5, 14)), line('M10.5 20.5V17h3v3.5')]),
    icon('school', 'School', ['education', 'campus', 'academy', 'classroom'], [body('M4 20.5V10l8-5.5 8 5.5v10.5Z'), accent(C(12, 11, 1.8)), line('M10 20.5V16h4v4.5')]),
    icon('factory', 'Factory', ['industry', 'manufacturing', 'plant', 'production'], [body('M3.5 20.5V10l5 3v-3l5 3v-3l4 2.5V4h3v16.5Z'), line(L(7, 16.5, 8.5, 16.5)), line(L(11.5, 16.5, 13, 16.5)), accent(L(16, 16.5, 17.5, 16.5))]),
  ],
};
