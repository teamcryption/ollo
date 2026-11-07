import { C, D } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'celebration',
  icons: [
    icon('snowman', 'Snowman', ['winter', 'snow', 'christmas', 'holiday', 'frosty'], [body(C(12, 15.5, 5)), body(C(12, 7.3, 3.4), { cover: true }), line(D(10.8, 6.8)), line(D(13.2, 6.8)), line(D(12, 14)), line(D(12, 17)), line('M7.5 12.5 4.5 10.5M16.5 12.5l3-2')], { noAccent: true }),
  ],
};
