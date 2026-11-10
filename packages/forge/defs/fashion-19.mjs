import { icon, body, line } from '../src/dsl.mjs';
import { R, D, rotateD } from '../src/geo.mjs';

const rot = (els, deg) => els.map((e) => ({ ...e, d: rotateD(e.d, deg) }));

export default {
  category: 'fashion',
  icons: [
    icon('tank-top', 'Tank Top', ['vest', 'singlet', 'sleeveless', 'gym top', 'summer'], [body('M8.5 3.5v3a3.5 3.5 0 0 0 7 0v-3h1.5c0 3 .5 5 1.5 6.5v9.5a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1V10c1-1.5 1.5-3.5 1.5-6.5Z')], { noAccent: true }),
  ],
};
