import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'buildings',
  icons: [
    icon('phone-booth', 'Phone Booth', ['telephone box', 'payphone', 'call box', 'street', 'booth'], [body(R(6.5, 3.5, 11, 17, 1.5)), line('M9 6.5h6'), line(R(9, 9, 6, 9, 0.5)), line('M12 9v9M9 13.5h6')], { noAccent: true }),
  ],
};
