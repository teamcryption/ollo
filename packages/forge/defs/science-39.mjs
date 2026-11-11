import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('flask-sparkle', 'AI Flask', ['ai', 'smart', 'magic', 'flask', 'flask'], [body('M7 3.5h5v4l4 7.5a1.5 1.5 0 0 1-1.3 2.2H4.3A1.5 1.5 0 0 1 3 15l4-7.5Z'), line('M5.3 12h8.4'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('dna-sparkle', 'AI DNA', ['ai', 'smart', 'magic', 'dna', 'dna'], [line('M6 3.5c0 4 7 4 7 8s-7 4-7 8M13 3.5c0 4-7 4-7 8s7 4 7 8M7.5 6.5h4M7.5 16.5h4'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('magnet-sparkle', 'AI Magnet', ['ai', 'smart', 'magic', 'magnet', 'magnet'], [body('M4.5 4h3.3v6.5a1.7 1.7 0 0 0 3.4 0V4h3.3v6.5a5 5 0 0 1-10 0Z'), line('M4.7 7.3h2.9M11.4 7.3h2.9'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('telescope-sparkle', 'AI Telescope', ['ai', 'smart', 'magic', 'telescope', 'telescope'], [body(poly([[3.5, 10], [12.5, 5], [14, 8], [5, 13]], 0.8, true)), line('M8.5 11.5 6 18M9.5 11 12 18'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('planet-sparkle', 'AI Planet', ['ai', 'smart', 'magic', 'planet', 'planet'], [body(C(9.5, 10.5, 4.3)), line(rotateD(E(9.5, 10.5, 7, 2), -25, 9.5, 10.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('ufo-sparkle', 'AI Ufo', ['ai', 'smart', 'magic', 'ufo', 'ufo'], [line('M6.6 8.4a2.9 2.9 0 0 1 5.8 0'), body('M3 11.5c0-1.7 2.9-3 6.5-3s6.5 1.3 6.5 3-2.9 3-6.5 3-6.5-1.3-6.5-3Z'), line('M7 15.8l-1.5 2.7M12 15.8l1.5 2.7'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('test-tube-sparkle', 'AI Test Tube', ['ai', 'smart', 'magic', 'test tube', 'test-tube'], [line(rotateD('M7 3.5h5', 30, 9.5, 10.5)), body(rotateD('M8 3.7h3v11a1.5 1.5 0 0 1-3 0Z', 30, 9.5, 10.5)), line(rotateD('M8.2 10h2.6', 30, 9.5, 10.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('comet-sparkle', 'AI Comet', ['ai', 'smart', 'magic', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('microscope-sparkle', 'AI Microscope', ['ai', 'smart', 'magic', 'microscope', 'microscope'], [body(R(7.5, 3.5, 3, 7.5, 0.8)), line('M5 18h9M12 18a4.5 4.5 0 0 0-1.5-7.8M9 11v2.5M7 14h4'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
