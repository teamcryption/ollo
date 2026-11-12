import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('film-bulb', 'Film Ideas', ['idea', 'tip', 'insight', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('music-bulb', 'Music Ideas', ['idea', 'tip', 'insight', 'music', 'music'], [line('M8 15.5V5.5l7-2v9.5'), body(C(6, 15.5, 2)), body(C(13, 13, 2)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('radio-bulb', 'Radio Ideas', ['idea', 'tip', 'insight', 'radio', 'radio'], [line('M5 7 12.5 3.5'), body(R(3, 7, 13, 10, 2)), line(C(7.5, 12, 2.2)), line('M12 10h1.5M12 12.5h1.5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('piano-bulb', 'Piano Ideas', ['idea', 'tip', 'insight', 'piano', 'piano'], [body(R(3, 4, 13, 12, 1.5)), line('M3.2 9h12.6'), line('M6.5 9.2v6.6M9.5 9.2v6.6M12.5 9.2v6.6'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('violin-bulb', 'Violin Ideas', ['idea', 'tip', 'insight', 'violin', 'violin'], [line('M9.5 3v5'), body('M9.5 7.5c1.8 0 3 .8 3 2.2 0 .8-.6 1.3-.6 1.8s1.1 1.2 1.1 2.7c0 2.2-1.6 3.3-3.5 3.3S6 16.4 6 14.2c0-1.5 1.1-2.2 1.1-2.7s-.6-1-.6-1.8c0-1.4 1.2-2.2 3-2.2Z'), line('M9.5 10.5v5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('trumpet-filter', 'Filter Trumpet', ['filter', 'sort', 'refine', 'trumpet', 'trumpet'], [line('M3 10.5h7.5M5 10.5V8.5M7.5 10.5V8.5'), body('M10.5 10.5 16 6v9Z'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
