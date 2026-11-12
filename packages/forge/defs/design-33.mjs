import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'design',
  icons: [
    icon('palette-calendar', 'Colour Palette Booking', ['booking', 'date', 'appointment', 'colour palette', 'palette'], [body('M9.5 3.5a7 7 0 0 0 0 14c1.2 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.3-2.2h2a2.5 2.5 0 0 0 2.5-2.5c0-4.2-3.1-7.5-7-7.5Z'), line(D(6.5, 8.5) + D(9.5, 6.8) + D(12.5, 8.5) + D(6.2, 12)), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('yarn-calendar', 'Yarn Booking', ['booking', 'date', 'appointment', 'yarn', 'yarn'], [body(C(9.5, 10, 6)), line('M5 7.2c3.2 0 6.6 2.3 8.7 6M4.2 11c3 0 6.2 1.7 8 5M7.8 4.3c2.6 1.4 4.6 3.8 5.9 6.8'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('paint-roller-calendar', 'Paint Roller Booking', ['booking', 'date', 'appointment', 'paint roller', 'paint-roller'], [body(R(3.5, 3.5, 11, 4.5, 1.5)), line('M14.7 5.8h1.3v4H9.5v2.5'), body(R(8.3, 12.5, 2.4, 6, 1)), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('spool-calendar', 'Thread Booking', ['booking', 'date', 'appointment', 'thread', 'spool'], [body(R(4, 3.5, 11, 2.5, 1)), body(R(4, 15.5, 11, 2.5, 1)), line('M5.5 6.2v9.1M13.5 6.2v9.1'), line('M5.8 8.6l7.4 2M5.8 11.4l7.4 2'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('crayon-calendar', 'Crayon Booking', ['booking', 'date', 'appointment', 'crayon', 'crayon'], [body(rotateD('M7.5 18V7.5l2-4 2 4V18Z', 40, 9.5, 10.5)), line(rotateD('M7.7 9.5h3.6M7.7 15h3.6', 40, 9.5, 10.5)), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('easel-calendar', 'Easel Booking', ['booking', 'date', 'appointment', 'easel', 'easel'], [body(R(4.5, 3.5, 10, 8.5, 1)), line('M7 12.2l-2 6.3M12 12.2l2 6.3M9.5 12.2v3'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('magic-wand-calendar', 'Magic Wand Booking', ['booking', 'date', 'appointment', 'magic wand', 'magic-wand'], [line('M4 17.5 12.5 9'), body(rotateD(R(11.6, 6.3, 2.6, 4.8, 0.8), 45, 12.9, 8.7)), line('M5.5 5v2.5M4.25 6.25h2.5M15.5 3.5v1.6M14.7 4.3h1.6'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('cube-calendar', '3D Cube Booking', ['booking', 'date', 'appointment', '3d cube', 'cube'], [body(poly([[9.5, 3], [16, 6.7], [16, 14.3], [9.5, 18], [3, 14.3], [3, 6.7]], 0.8, true)), line('M3.3 6.9l6.2 3.6 6.2-3.6M9.5 10.6v7.1'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('spray-can-calendar', 'Spray Can Booking', ['booking', 'date', 'appointment', 'spray can', 'spray-can'], [line(D(14.5, 3.5) + D(15.8, 5) + D(14.2, 6.2)), body(R(8, 3, 2.8, 2.5, 0.6)), body(R(6, 7, 7, 11, 2)), line('M6.2 11h6.6'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('layers-calendar', 'Layers Booking', ['booking', 'date', 'appointment', 'layers', 'layers'], [body(poly([[9.5, 4], [16, 7.5], [9.5, 11], [3, 7.5]], 0.8, true)), line('M3 11l6.5 3.5L16 11M3 14.5l6.5 3.5 6.5-3.5'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('paint-bucket-calendar', 'Paint Bucket Booking', ['booking', 'date', 'appointment', 'paint bucket', 'paint-bucket'], [line('M4.5 7.5a5 5 0 0 1 10 0'), body(poly([[3.5, 7.8], [15.5, 7.8], [14.5, 18], [4.5, 18]], 0.8, true)), line('M9 7.9c0 2.5 1.5 3 1.5 4.5'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
  ],
};
