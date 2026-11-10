import { icon, body, line } from '../src/dsl.mjs';
import { rotateD } from '../src/geo.mjs';

const BLADE = 'M12 13c1.8 0 3 1.2 3 3v3c0 1.1-1.3 2-3 2s-3-.9-3-2v-3c0-1.8 1.2-3 3-3Z';

export default {
  category: 'sports',
  icons: [
    icon('oar', 'Oar', ['rowing', 'paddle', 'boat', 'canoe', 'water sports'], [line(rotateD('M12 3v10M10.8 3h2.4', 35)), body(rotateD(BLADE, 35))], { noAccent: true }),
  ],
};
