import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('magnet-upload', 'Upload Magnet', ['upload', 'send', 'export', 'magnet', 'magnet'], [body('M4.5 4h3.3v6.5a1.7 1.7 0 0 0 3.4 0V4h3.3v6.5a5 5 0 0 1-10 0Z'), line('M4.7 7.3h2.9M11.4 7.3h2.9'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('microscope-upload', 'Upload Microscope', ['upload', 'send', 'export', 'microscope', 'microscope'], [body(R(7.5, 3.5, 3, 7.5, 0.8)), line('M5 18h9M12 18a4.5 4.5 0 0 0-1.5-7.8M9 11v2.5M7 14h4'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('petri-dish-upload', 'Upload Petri Dish', ['upload', 'send', 'export', 'petri dish', 'petri-dish'], [line(E(9.5, 10, 6.5, 3)), body('M3 10v3c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-3'), line(D(7.5, 9.5) + D(10.5, 10.6) + D(12, 9.2)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('beaker-upload', 'Upload Beaker', ['upload', 'send', 'export', 'beaker', 'beaker'], [line('M5 3.5h9'), body('M6 3.7h7V16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z'), line('M6.2 10h3M6.2 13h2'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('lab-coat-upload', 'Upload Lab Coat', ['upload', 'send', 'export', 'lab coat', 'lab-coat'], [body('M6.5 3.5h6L16 6.5V18H3V6.5Z'), line('M9.5 6v12M6.5 3.7l3 3 3-3'), line('M11.5 12.5h2.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('molecule-upload', 'Upload Molecule', ['upload', 'send', 'export', 'molecule', 'molecule'], [line(C(9.5, 10.5, 2.2) + C(4.5, 5, 1.6) + C(14.5, 5, 1.6) + C(9.5, 17, 1.6)), line('M5.6 6.2 8 8.8M13.4 6.2 11 8.8M9.5 12.7v2.7'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('fossil-upload', 'Upload Fossil', ['upload', 'send', 'export', 'fossil', 'fossil'], [body(C(9.5, 10.5, 6.5)), line('M9.5 10.5a1.3 1.3 0 0 1 2.6 0 2.6 2.6 0 0 1-5.2 0 3.9 3.9 0 0 1 7.8 0'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('astronaut-upload', 'Upload Astronaut', ['upload', 'send', 'export', 'astronaut', 'astronaut'], [body(C(9.5, 7.5, 4.5)), body(R(6.8, 5.8, 5.4, 3.4, 1.4)), body('M4.5 18v-2a3.5 3.5 0 0 1 3.5-3.5h3a3.5 3.5 0 0 1 3.5 3.5v2Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
