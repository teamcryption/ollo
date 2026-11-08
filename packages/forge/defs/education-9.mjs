import { R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'education',
  icons: [
    icon('pencil-case', 'Pencil Case', ['pouch', 'stationery', 'school', 'supplies', 'zip'], [body(R(3, 8, 18, 10, 4)), line('M6.5 12h11M15.5 12v2.5'), line('M6.5 8V4.5L7.75 3 9 4.5V8')], { noAccent: true }),
  ],
};
