import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('parcel-locker', 'Parcel Locker', ['pickup point', 'locker', 'collection point', 'delivery box', 'click and collect'], [body(R(3.5, 3.5, 17, 17, 2)), line(L(12, 3.7, 12, 20.3)), line(L(3.7, 9, 12, 9)), line(L(3.7, 14.5, 12, 14.5)), line(L(12.2, 12, 20.3, 12)), accent(L(14.5, 6.5, 14.5, 8.5))]),
  ],
};
