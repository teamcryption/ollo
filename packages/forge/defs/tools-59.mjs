import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'tools',
  icons: [
    icon('toolbox-bulb', 'Toolbox Ideas', ['idea', 'tip', 'insight', 'toolbox', 'toolbox'], [line('M7 7V5.5h5V7'), body(R(3, 7, 13, 9, 1.5)), line('M3.2 11h12.6'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('wheelbarrow-bulb', 'Wheelbarrow Ideas', ['idea', 'tip', 'insight', 'wheelbarrow', 'wheelbarrow'], [line('M15.5 7.5l1-2'), body(poly([[3.5, 7.5], [15.5, 7.5], [13, 12.5], [6, 12.5]], 0.6, true)), line(C(7, 15.6, 2)), line('M12 12.7v4.5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('screw-bulb', 'Screw Ideas', ['idea', 'tip', 'insight', 'screw', 'screw'], [body(R(5.5, 3.5, 8, 3, 1)), body('M7 7.2h5v6.8l-2.5 4L7 14Z'), line('M7.2 9.3l4.6-1M7.2 11.8l4.6-1'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('toolbox-open-bulb', 'Toolbox Open Ideas', ['idea', 'tip', 'insight', 'toolbox open', 'toolbox-open'], [line('M7 7.5V5.5h5v2'), body(R(3, 7.5, 13, 9.5, 1.5)), line('M3.2 11h12.6M8 11v2h3v-2'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('bulldozer-filter', 'Filter Bulldozer', ['filter', 'sort', 'refine', 'bulldozer', 'bulldozer'], [body(R(5, 6, 6, 5, 1)), body(R(3, 11, 10, 4, 2)), line('M13 9h2l1.5 6'), line(D(5.5, 13) + D(10.5, 13)), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('excavator-filter', 'Filter Excavator', ['filter', 'sort', 'refine', 'excavator', 'excavator'], [body(R(3, 9, 7, 4, 1)), body(R(2.5, 14, 9, 3, 1.5)), line('M10 10l3-5 3 4'), body('M16 9.5l1 3h-3Z'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('drill-filter', 'Filter Drill', ['filter', 'sort', 'refine', 'drill', 'drill'], [body('M4 6h8.5A1.5 1.5 0 0 1 14 7.5v1A1.5 1.5 0 0 1 12.5 10H10l-.5 7.5h-3L7 10H4Z'), line('M14 8h2.5'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
