import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('traffic-light-chat', 'Traffic Light Chat', ['chat', 'support', 'message', 'traffic light', 'traffic-light'], [body(R(6.3, 3, 6.4, 15.5, 3.2)), line(C(9.5, 6.6, 1.3) + C(9.5, 10.7, 1.3) + C(9.5, 14.8, 1.3)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('traffic-cone-chat', 'Traffic Cone Chat', ['chat', 'support', 'message', 'traffic cone', 'traffic-cone'], [body(poly([[8, 4], [11, 4], [14, 16], [5, 16]], 0.8, true)), line('M7.2 8.5h4.6M6.3 12.3h6.4'), line('M3.5 17.8h12'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('traffic-light-download', 'Download Traffic Light', ['download', 'save', 'export', 'traffic light', 'traffic-light'], [body(R(6.3, 3, 6.4, 15.5, 3.2)), line(C(9.5, 6.6, 1.3) + C(9.5, 10.7, 1.3) + C(9.5, 14.8, 1.3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('traffic-cone-download', 'Download Traffic Cone', ['download', 'save', 'export', 'traffic cone', 'traffic-cone'], [body(poly([[8, 4], [11, 4], [14, 16], [5, 16]], 0.8, true)), line('M7.2 8.5h4.6M6.3 12.3h6.4'), line('M3.5 17.8h12'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('taxi-pencil', 'Edit Taxi', ['edit', 'write', 'modify', 'taxi', 'taxi'], [line('M7.5 8V6h4v2'), body(R(3.5, 8, 12, 6.5, 1.5)), line(D(6, 11.2) + D(13, 11.2)), line('M5 14.5V16M14 14.5V16'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
