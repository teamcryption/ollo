import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('video-pause', 'Pause Video', ['pause', 'hold', 'stop', 'video', 'video'], [body(R(3, 6, 9.5, 8, 1.5)), body(poly([[13.3, 8.5], [16, 7], [16, 13], [13.3, 11.5]], 0.5, true)), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('inbox-pause', 'Pause Inbox', ['pause', 'hold', 'stop', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('mail-pause', 'Pause Mail', ['pause', 'hold', 'stop', 'mail', 'mail'], [body(R(3, 5.5, 13, 10, 1.8)), line('M3.5 6.5l6 4.5 6-4.5'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('message-leaf', 'Eco Message', ['eco', 'green', 'sustainable', 'message', 'message'], [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('video-leaf', 'Eco Video', ['eco', 'green', 'sustainable', 'video', 'video'], [body(R(3, 6, 9.5, 8, 1.5)), body(poly([[13.3, 8.5], [16, 7], [16, 13], [13.3, 11.5]], 0.5, true)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('inbox-leaf', 'Eco Inbox', ['eco', 'green', 'sustainable', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('satellite-dish-leaf', 'Eco Satellite Dish', ['eco', 'green', 'sustainable', 'satellite dish', 'satellite-dish'], [body('M4.5 5.5l9 9a6.4 6.4 0 0 1-9-9Z'), line('M9 10l3-3'), line(D(12.8, 6.2)), line('M7.2 15.3 5.5 18.5h5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('antenna-leaf', 'Eco Antenna', ['eco', 'green', 'sustainable', 'antenna', 'antenna'], [line('M6.5 4.5a4.2 4.2 0 0 0 0 6M12.5 4.5a4.2 4.2 0 0 1 0 6'), body(C(9.5, 7.5, 1.5)), line('M9.5 9.2v9.3M6.5 18.5h6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('walkie-talkie-leaf', 'Eco Walkie Talkie', ['eco', 'green', 'sustainable', 'walkie talkie', 'walkie-talkie'], [line('M7 6V3'), body(R(5, 6, 9, 12.5, 2)), line('M7.5 9.5h4M7.5 11.5h4'), line(D(9.5, 15)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('paper-plane-leaf', 'Eco Paper Plane', ['eco', 'green', 'sustainable', 'paper plane', 'paper-plane'], [body(poly([[3, 9.5], [16, 3.5], [11.5, 17], [9, 11.5]], 0.6, true)), line('M9.2 11.3 15.8 3.8'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('envelope-open-leaf', 'Eco Open Mail', ['eco', 'green', 'sustainable', 'open mail', 'envelope-open'], [body('M3 9l6.5-5 6.5 5v8.5H3Z'), line('M3.3 9.3l6.2 4.2 6.2-4.2'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
