import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'devices',
  icons: [
    icon('scanner', 'Scanner', ['flatbed', 'scan document', 'copy', 'office'], [line(L(3.5, 10.5, 19, 5.5)), body(R(3, 11, 18, 8, 2)), accent(L(6, 15, 12, 15)), line(D(17, 15))]),
    icon('earbuds', 'Earbuds', ['wireless earphones', 'buds', 'audio', 'in-ear'], [body(C(8, 8, 3)), line(L(9.5, 10.7, 9.5, 18.5)), body(C(16, 8, 3)), line(L(14.5, 10.7, 14.5, 18.5))], { noAccent: true }),
    icon('smart-speaker', 'Smart Speaker', ['voice assistant', 'home speaker', 'speaker', 'assistant'], [body(R(7, 3.5, 10, 17, 5)), accent(L(10, 7.5, 14, 7.5)), line(C(12, 14.5, 2.3))]),
    icon('dual-monitor', 'Dual Monitor', ['two screens', 'workstation', 'extended display', 'setup'], [line(R(9.5, 4, 11.5, 8.5, 1.5)), body(R(3, 8, 11.5, 8.5, 1.5), { cover: true }), line(L(8.75, 16.7, 8.75, 19)), line(L(6, 19.5, 11.5, 19.5))], { noAccent: true }),
    icon('tablet-pen', 'Tablet and Pen', ['stylus', 'drawing tablet', 'ipad', 'sketch'], [body(R(4, 3, 13, 18, 2.5)), accent(L(9, 18, 12, 18)), body(R(18.3, 5, 2.4, 12, 1.2)), line(L(19.5, 17.2, 19.5, 19))]),
  ],
};
