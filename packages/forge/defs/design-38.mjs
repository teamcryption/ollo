import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'design',
  icons: [
    icon('bezier-pause', 'Pause Bezier', ['pause', 'hold', 'stop', 'bezier', 'bezier'], [line('M3.5 16C5 9 14 12 15.5 5'), body(R(2, 14.5, 3, 3, 0.6)), body(R(14, 3.5, 3, 3, 0.6)), line('M3.5 16 9 9.5'), line(C(9, 9.5, 0.01)), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('paint-roller-leaf', 'Eco Paint Roller', ['eco', 'green', 'sustainable', 'paint roller', 'paint-roller'], [body(R(3.5, 3.5, 11, 4.5, 1.5)), line('M14.7 5.8h1.3v4H9.5v2.5'), body(R(8.3, 12.5, 2.4, 6, 1)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('spool-leaf', 'Eco Thread', ['eco', 'green', 'sustainable', 'thread', 'spool'], [body(R(4, 3.5, 11, 2.5, 1)), body(R(4, 15.5, 11, 2.5, 1)), line('M5.5 6.2v9.1M13.5 6.2v9.1'), line('M5.8 8.6l7.4 2M5.8 11.4l7.4 2'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('crayon-leaf', 'Eco Crayon', ['eco', 'green', 'sustainable', 'crayon', 'crayon'], [body(rotateD('M7.5 18V7.5l2-4 2 4V18Z', 40, 9.5, 10.5)), line(rotateD('M7.7 9.5h3.6M7.7 15h3.6', 40, 9.5, 10.5)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('easel-leaf', 'Eco Easel', ['eco', 'green', 'sustainable', 'easel', 'easel'], [body(R(4.5, 3.5, 10, 8.5, 1)), line('M7 12.2l-2 6.3M12 12.2l2 6.3M9.5 12.2v3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('magic-wand-leaf', 'Eco Magic Wand', ['eco', 'green', 'sustainable', 'magic wand', 'magic-wand'], [line('M4 17.5 12.5 9'), body(rotateD(R(11.6, 6.3, 2.6, 4.8, 0.8), 45, 12.9, 8.7)), line('M5.5 5v2.5M4.25 6.25h2.5M15.5 3.5v1.6M14.7 4.3h1.6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('cube-leaf', 'Eco 3D Cube', ['eco', 'green', 'sustainable', '3d cube', 'cube'], [body(poly([[9.5, 3], [16, 6.7], [16, 14.3], [9.5, 18], [3, 14.3], [3, 6.7]], 0.8, true)), line('M3.3 6.9l6.2 3.6 6.2-3.6M9.5 10.6v7.1'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('spray-can-leaf', 'Eco Spray Can', ['eco', 'green', 'sustainable', 'spray can', 'spray-can'], [line(D(14.5, 3.5) + D(15.8, 5) + D(14.2, 6.2)), body(R(8, 3, 2.8, 2.5, 0.6)), body(R(6, 7, 7, 11, 2)), line('M6.2 11h6.6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('layers-leaf', 'Eco Layers', ['eco', 'green', 'sustainable', 'layers', 'layers'], [body(poly([[9.5, 4], [16, 7.5], [9.5, 11], [3, 7.5]], 0.8, true)), line('M3 11l6.5 3.5L16 11M3 14.5l6.5 3.5 6.5-3.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
