import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('traffic-barrier-upload', 'Upload Traffic Barrier', ['upload', 'send', 'export', 'traffic barrier', 'traffic-barrier'], [body(R(3, 5, 13, 5.5, 1)), line('M6.5 5.2l-2.8 5.1M10.5 5.2l-2.8 5.1M14.5 5.2l-2.8 5.1'), line('M5.5 10.7v7.3M13.5 10.7v7.3M4 18h3M12 18h3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('steering-wheel-upload', 'Upload Steering Wheel', ['upload', 'send', 'export', 'steering wheel', 'steering-wheel'], [body(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 1.7)), line('M3.2 9.5h4.6M11.2 9.5h4.6M9.5 12.2v4.6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('tractor-upload', 'Upload Tractor', ['upload', 'send', 'export', 'tractor', 'tractor'], [body('M3.5 13V8.5h3l1-4h4v4H13a2 2 0 0 1 2 2V13Z'), line(C(6.5, 15.5, 2.5)), line(C(13.5, 16, 1.8)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('rv-upload', 'Upload Camper Van', ['upload', 'send', 'export', 'camper van', 'rv'], [body('M3 6.5A1.5 1.5 0 0 1 4.5 5H13l3 4.5V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z'), line('M5.5 8h3.5v3H5.5Z'), line(C(6, 16.3, 1.5) + C(12.5, 16.3, 1.5)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('tollbooth-upload', 'Upload Tollbooth', ['upload', 'send', 'export', 'tollbooth', 'tollbooth'], [body(R(3.5, 6, 5.5, 12, 1)), line('M2.5 5.5l4-2 4 2'), line('M5 9.5h2.5'), line('M9.2 12.5H16.5'), body(R(15, 11.3, 1.8, 2.4, 0.6)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
