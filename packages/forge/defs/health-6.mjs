import { R, C, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'health',
  icons: [
    icon('toothbrush', 'Toothbrush', ['dental', 'teeth', 'brush', 'hygiene', 'bathroom'], [body(rotateD(R(10.5, 3, 3, 18, 1.5), 35)), line(rotateD('M10.5 4.5H7.5M10.5 6.5H7.5M10.5 8.5H7.5', 35))], { noAccent: true }),
    icon('soap', 'Soap', ['wash', 'hygiene', 'clean', 'bubbles', 'hands'], [body(R(3.5, 11, 15, 8.5, 3)), line('M7 14.5h3.5'), line(C(16.5, 6.3, 2.3)), accent(C(11, 7, 1.2))]),
  ],
};
