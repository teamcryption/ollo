import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('train-pause', 'Pause Train', ['pause', 'hold', 'stop', 'train', 'train'], [body(R(4.5, 3.5, 10, 12, 3)), line('M4.7 9.5h9.6'), line(D(7, 12.5) + D(12, 12.5)), line('M6.5 15.5 5 18M12.5 15.5 14 18'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('taxi-pause', 'Pause Taxi', ['pause', 'hold', 'stop', 'taxi', 'taxi'], [line('M7.5 8V6h4v2'), body(R(3.5, 8, 12, 6.5, 1.5)), line(D(6, 11.2) + D(13, 11.2)), line('M5 14.5V16M14 14.5V16'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('car-pause', 'Pause Car', ['pause', 'hold', 'stop', 'car', 'car'], [body('M3.5 12.5l1.6-4.3A1.5 1.5 0 0 1 6.5 7.2h6a1.5 1.5 0 0 1 1.4 1l1.6 4.3V16h-12Z'), line('M3.7 12.5h11.6'), line('M5 16v1.5M14 16v1.5'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('rv-pause', 'Pause Camper Van', ['pause', 'hold', 'stop', 'camper van', 'rv'], [body('M3 6.5A1.5 1.5 0 0 1 4.5 5H13l3 4.5V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z'), line('M5.5 8h3.5v3H5.5Z'), line(C(6, 16.3, 1.5) + C(12.5, 16.3, 1.5)), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('speedometer-pause', 'Pause Speedometer', ['pause', 'hold', 'stop', 'speedometer', 'speedometer'], [body('M3 14a6.5 6.5 0 1 1 13 0Z'), line('M9.5 13.5l3-4.5'), line('M5.5 12h1M12.5 12h1M9.5 8.5v1'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('car-side-pause', 'Pause Car Side', ['pause', 'hold', 'stop', 'car side', 'car-side'], [body('M2.5 13.5v-2.5l2-4h8l2.5 4h1.5v2.5Z'), line('M5 10.5h9'), line(C(6, 14.5, 1.6) + C(13, 14.5, 1.6)), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('traffic-light-leaf', 'Eco Traffic Light', ['eco', 'green', 'sustainable', 'traffic light', 'traffic-light'], [body(R(6.3, 3, 6.4, 15.5, 3.2)), line(C(9.5, 6.6, 1.3) + C(9.5, 10.7, 1.3) + C(9.5, 14.8, 1.3)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('traffic-cone-leaf', 'Eco Traffic Cone', ['eco', 'green', 'sustainable', 'traffic cone', 'traffic-cone'], [body(poly([[8, 4], [11, 4], [14, 16], [5, 16]], 0.8, true)), line('M7.2 8.5h4.6M6.3 12.3h6.4'), line('M3.5 17.8h12'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('stop-sign-leaf', 'Eco Stop Sign', ['eco', 'green', 'sustainable', 'stop sign', 'stop-sign'], [body(poly([[15.04,11.3],[11.8,14.54],[7.2,14.54],[3.96,11.3],[3.96,6.7],[7.2,3.46],[11.8,3.46],[15.04,6.7]], 0.8, true)), line('M7 9h5'), line('M9.5 15.2v3.3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('submarine-leaf', 'Eco Submarine', ['eco', 'green', 'sustainable', 'submarine', 'submarine'], [line('M10 6.3V4h1.5'), line('M8 9V6.5h3V9'), body('M3.5 12.5A3.5 3.5 0 0 1 7 9h6a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H7a3.5 3.5 0 0 1-3.5-3.5Z'), line(D(7, 12.5) + D(10, 12.5)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('traffic-barrier-leaf', 'Eco Traffic Barrier', ['eco', 'green', 'sustainable', 'traffic barrier', 'traffic-barrier'], [body(R(3, 5, 13, 5.5, 1)), line('M6.5 5.2l-2.8 5.1M10.5 5.2l-2.8 5.1M14.5 5.2l-2.8 5.1'), line('M5.5 10.7v7.3M13.5 10.7v7.3M4 18h3M12 18h3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
