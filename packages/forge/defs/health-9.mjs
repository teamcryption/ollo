import { R, C, E, L, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'health',
  icons: [
    icon('mortar-pestle', 'Mortar and Pestle', ['pharmacy', 'apothecary', 'grind', 'herbs', 'medicine'], [body(rotateD(R(11, 2.5, 3, 10, 1.5), 35)), body('M3.5 11h17c0 4.4-3.8 8-8.5 8S3.5 15.4 3.5 11Z', { cover: true }), line(L(9, 20.5, 15, 20.5))], { noAccent: true }),
    icon('blood-pressure', 'Blood Pressure', ['blood pressure monitor', 'cuff', 'hypertension', 'vitals', 'gauge'], [line('M15 14.5v2a2.5 2.5 0 0 1-2.5 2.5H8.5'), body(E(6, 19, 2.5, 1.6)), body(C(15, 9, 5.5)), accent(L(15, 9, 17.2, 6.8))]),
  ],
};
