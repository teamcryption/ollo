import { icon, body, line, accent } from '../src/dsl.mjs';
import { D } from '../src/geo.mjs';

const CLOUD_HI = 'M7 15a3.8 3.8 0 0 1-.5-7.6 5.5 5.5 0 0 1 10.6 1A3.3 3.3 0 0 1 17 15Z';

export default {
  category: 'weather',
  icons: [
    icon('sleet', 'Sleet', ['freezing rain', 'ice pellets', 'wintry mix', 'weather', 'cold'], [body(CLOUD_HI), line('M8 17.5l-1 3M14.5 17.5l-1 3'), accent(D(11, 19) + D(17.5, 19))]),
  ],
};
