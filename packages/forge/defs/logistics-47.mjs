import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'logistics',
  icons: [
    icon('container-bulb', 'Shipping Container Ideas', ['idea', 'tip', 'insight', 'shipping container', 'container'], [body(R(3, 6, 13, 9, 1)), line('M6 8v5M9 8v5M12 8v5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('parcel-locker-bulb', 'Parcel Locker Ideas', ['idea', 'tip', 'insight', 'parcel locker', 'parcel-locker'], [body(R(3, 3.5, 13, 15, 1.2)), line('M9.5 3.7v14.6M3.2 8.5h6.1M3.2 13.5h6.1M9.7 11h6.1'), line('M7.8 6v.5M7.8 11v.5M7.8 16v.5M14.3 6.5v.5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('warehouse-filter', 'Filter Warehouse', ['filter', 'sort', 'refine', 'warehouse', 'warehouse'], [body('M3 8l6.5-4L16 8v10H3Z'), line('M6 18v-6h7v6M6 14.5h7'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
