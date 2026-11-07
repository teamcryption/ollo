import { R, C, L, A, poly, D, mirrorD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const LOBE = 'M9.5 8c-3 0-5.5 4-5.5 9 0 2 1 3.5 3 3.5s3-1.5 3-3.5V9a1 1 0 0 0-.5-1Z';

export default {
  category: 'health',
  icons: [
    icon('lungs', 'Lungs', ['breathing', 'respiratory', 'chest', 'pulmonary'], [line(L(12, 3.5, 12, 10)), line('M12 10l-1.5 1.5M12 10l1.5 1.5'), body(LOBE), body(mirrorD(LOBE))], { noAccent: true, anim: 'pulse' }),
    icon('sanitizer', 'Hand Sanitiser', ['sanitizer', 'hygiene', 'soap', 'clean hands'], [line('M10 3.5h4M12 3.5V7M14 3.5h1.5'), body(R(7, 7, 10, 13.5, 2.5)), accent('M12 11s1.5 1.6 1.5 2.6a1.5 1.5 0 0 1-3 0c0-1 1.5-2.6 1.5-2.6Z')]),
    icon('xray', 'X-Ray', ['radiology', 'scan', 'skeleton', 'ribs'], [body(R(3.5, 3.5, 17, 17, 2.5)), line(L(12, 6, 12, 18)), line('M8 8.5h8M7.5 11.5h9M8 14.5h8')], { noAccent: true }),
    icon('medical-chart', 'Medical Chart', ['patient record', 'diagnosis', 'health record', 'vitals'], [body(R(5, 4.5, 14, 16.5, 2.5)), body(R(9, 3, 6, 3.5, 1.5), { cover: true }), accent(poly([[7.5, 13.5], [9.5, 13.5], [10.8, 10.5], [12.8, 16.5], [14.2, 13.5], [16.5, 13.5]], 0.3))]),
  ],
};
