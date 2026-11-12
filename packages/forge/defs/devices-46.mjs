import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('monitor-upload', 'Upload Monitor', ['upload', 'send', 'export', 'monitor', 'monitor'], [body(R(3, 4, 13, 9.5, 1.5)), line('M9.5 13.5v3M6.5 16.5h6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('speaker-upload', 'Upload Speaker', ['upload', 'send', 'export', 'speaker', 'speaker'], [body(R(4.5, 3.5, 10, 15, 2)), line(C(9.5, 12.5, 2.8)), line(D(9.5, 6.8)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('sd-card-upload', 'Upload SD Card', ['upload', 'send', 'export', 'sd card', 'sd-card'], [body('M6.5 3.5h7A1.5 1.5 0 0 1 15 5v12a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 17V6Z'), line('M7.5 6v2.5M10 6v2.5M12.5 6v2.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ram-upload', 'Upload RAM', ['upload', 'send', 'export', 'ram', 'ram'], [body(R(3, 6, 13, 7.5, 1)), line('M5.8 8.5v3M8.5 8.5v3M11.2 8.5v3'), line('M4.5 13.7v2M7 13.7v2M9.5 13.7v2M12 13.7v2M14.5 13.7v2'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('tablet-upload', 'Upload Tablet', ['upload', 'send', 'export', 'tablet', 'tablet'], [body(R(4.5, 3.5, 10, 15, 2)), line('M8.5 15.5h2'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('smart-speaker-upload', 'Upload Smart Speaker', ['upload', 'send', 'export', 'smart speaker', 'smart-speaker'], [body('M5 6a4.5 2 0 0 1 9 0v10a4.5 2 0 0 1-9 0Z'), line('M5.2 6.3a4.5 2 0 0 0 8.6 0'), line(D(7.5, 11) + D(9.5, 11.5) + D(11.5, 11)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('graphics-card-upload', 'Upload Graphics Card', ['upload', 'send', 'export', 'graphics card', 'graphics-card'], [body(R(3, 6, 13, 8, 1.2)), line(C(7.5, 10, 2.2)), line('M11.5 8.5h2.5M11.5 11.5h2.5'), line('M5 14.2v2.3h5v-2.3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('touchscreen-upload', 'Upload Touchscreen', ['upload', 'send', 'export', 'touchscreen', 'touchscreen'], [body(R(5, 3, 9, 15.5, 2)), line('M8 13.5V9.5a1 1 0 0 1 2 0V12l2 .5a1 1 0 0 1 .7 1.1l-.4 2.4H9.3Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
