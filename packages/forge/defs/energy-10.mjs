import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'energy',
  icons: [
    icon('generator', 'Generator', ['backup power', 'genset', 'portable power', 'electricity', 'engine'], [line('M7 7V5h10v2'), body(R(3.5, 7, 17, 11, 2.5)), line('M12.5 9.5 10 13h4l-2.5 3.5'), line('M6.5 18v2M17.5 18v2')], { noAccent: true }),
    icon('biofuel', 'Biofuel', ['biodiesel', 'renewable fuel', 'green fuel', 'ethanol', 'eco fuel'], [body('M12 3.5c3 3.7 6 7.2 6 10.5a6 6 0 0 1-12 0c0-3.3 3-6.8 6-10.5Z'), line('M9.5 17c0-3 2-5 5-5 0 3-2 5-5 5ZM9.5 17l2.5-2.5')], { noAccent: true }),
  ],
};
