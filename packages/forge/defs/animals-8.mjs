import { C, E, R, D, poly, mirrorD } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

const EAR = poly([[4.6, 10], [4.8, 3.5], [10.2, 5.9]], 0.9, true);
const HORN = 'M9 5.8c-1-.6-1.6-1.6-1.6-2.8';
const COWEAR = 'M7 8.6c-1.6.3-2.9-.2-3.8-1.3';

export default {
  category: 'animals',
  icons: [
    icon('pig', 'Pig', ['piglet', 'farm', 'pork', 'hog', 'animal'], [body(EAR), body(mirrorD(EAR)), body(C(12, 13, 7.5), { cover: true }), line(E(12, 15.3, 3, 2.2)), line(D(11, 15.3) + D(13, 15.3)), line(D(9, 11) + D(15, 11))], { noAccent: true }),
    icon('cow', 'Cow', ['cattle', 'farm', 'dairy', 'milk', 'bull', 'animal'], [line(HORN), line(mirrorD(HORN)), line(COWEAR), line(mirrorD(COWEAR)), body(R(7, 5.5, 10, 11, 4)), body(E(12, 17, 5, 3.5), { cover: true }), line(D(10.3, 17) + D(13.7, 17)), line(D(9.8, 10) + D(14.2, 10))], { noAccent: true }),
    icon('duck', 'Duck', ['rubber duck', 'bird', 'bath', 'toy', 'pond', 'animal'], [body('M3.5 11.5c1.5 1.8 4 2.5 7.5 2.5h6.5a3 3 0 0 1 3 3c0 2-2.5 3.5-8.5 3.5-5 0-8.5-3-8.5-9Z'), body(C(14, 10.2, 3.8), { cover: true }), body(poly([[17.2, 8.6], [21, 10.2], [17.2, 11.8]], 0.6, true)), line('M7.5 16.3c1.5 1.3 3.5 1.3 5 0'), line(D(14.8, 9.2))], { noAccent: true }),
  ],
};
