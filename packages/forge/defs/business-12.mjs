import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'business',
  icons: [
    icon('binder-clip', 'Binder Clip', ['paper clip', 'office', 'stationery', 'clamp', 'documents'], [line('M8.5 10.5 7.5 3.5h3l-.5 7M15.5 10.5l1-7h-3l.5 7'), body(poly([[6, 10], [18, 10], [19.5, 20], [4.5, 20]], 1.5, true))], { noAccent: true }),
  ],
};
