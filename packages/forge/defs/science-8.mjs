import { R, C, E, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'science',
  icons: [
    icon('bacteria', 'Bacteria', ['bacterium', 'germ', 'microbe', 'infection', 'biology'], [line('M18.1 8.5l1 .3.6-1 1 .3M5.9 15.5l-1-.3-.6 1-1-.3'), body(rotateD(R(5, 9, 14, 6, 3), -30)), accent(D(10.5, 12.9) + D(13.5, 11.1))]),
    icon('cell', 'Cell', ['biology', 'nucleus', 'organism', 'microscopic', 'life'], [body(E(12, 12, 8.5, 7.5)), line(C(10, 11.5, 3)), accent(D(15.5, 14.5) + D(15.5, 9))]),
    icon('vial', 'Vial', ['vaccine', 'sample', 'medicine', 'dose', 'lab'], [body(R(8.5, 3.5, 7, 3, 1)), body('M9.5 6.5v11.5a2.5 2.5 0 0 0 5 0V6.5'), line('M9.5 12.5h5')], { noAccent: true }),
  ],
};
