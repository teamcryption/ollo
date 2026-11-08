import { icon, body, line } from '../src/dsl.mjs';
import { rotateD } from '../src/geo.mjs';

const BLADE = 'M12 10 12 4.5 16 7Z';

export default {
  category: 'gaming',
  icons: [
    icon('pinwheel', 'Pinwheel', ['windmill toy', 'spinner', 'toy', 'wind', 'kids'], [body(BLADE), body(rotateD(BLADE, 90, 12, 10)), body(rotateD(BLADE, 180, 12, 10)), body(rotateD(BLADE, 270, 12, 10)), line('M12 15.5v5')], { noAccent: true, anim: 'spin' }),
  ],
};
