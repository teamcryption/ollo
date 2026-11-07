import { R, rotateD } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('snowboard', 'Snowboard', ['snowboarding', 'snow', 'winter', 'board', 'slope'], [body(rotateD(R(9, 2.5, 6, 19, 3), 45)), body(rotateD(R(9.8, 7, 4.4, 2.4, 0.8), 45)), body(rotateD(R(9.8, 14.6, 4.4, 2.4, 0.8), 45))], { noAccent: true }),
  ],
};
