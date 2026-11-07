import { R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('sled', 'Sled', ['sledge', 'toboggan', 'snow', 'winter sport', 'sleigh'], [body(R(5, 9.5, 12, 3.5, 1)), line('M7.5 13.2V17M14.5 13.2V17'), line('M3.5 17h14a3 3 0 0 0 3-3')], { noAccent: true }),
  ],
};
