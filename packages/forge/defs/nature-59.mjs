import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('waves-pause', 'Pause Waves', ['pause', 'hold', 'stop', 'waves', 'waves'], [line('M3 7c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0M3 11c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0M3 15c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('plant-leaf', 'Eco Plant', ['eco', 'green', 'sustainable', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('sun-leaf', 'Eco Sun', ['eco', 'green', 'sustainable', 'sun', 'sun'], [body(C(9.5, 10.5, 3.2)), line('M9.5 3.5V5M9.5 16v1.5M2.5 10.5H4M15 10.5h1.5M4.6 5.6l1 1M13.4 14.4l1 1M14.4 5.6l-1 1M5.6 14.4l-1 1'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('tree-leaf', 'Eco Tree', ['eco', 'green', 'sustainable', 'tree', 'tree'], [body('M9.5 3c3 0 5 2.3 5 5 0 2.5-2 4.5-5 4.5s-5-2-5-4.5c0-2.7 2-5 5-5Z'), line('M9.5 12.5V18M7 18h5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('flower-leaf', 'Eco Flower', ['eco', 'green', 'sustainable', 'flower', 'flower'], [body(C(9.5, 7, 3.5)), line(C(9.5, 7, 1.2)), line('M9.5 10.5v7.5M9.5 15c-1.3-1.6-2.8-2-4.3-1.8'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('flame-leaf', 'Eco Fire', ['eco', 'green', 'sustainable', 'fire', 'flame'], [body('M9.5 3.5c3 2.8 5 5.3 5 8.5a5 5 0 0 1-10 0c0-2 1-3.5 2.3-4.8.3 1.5 1 2.5 2 2.8-.4-2.5.2-4.6.7-6.5Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('cactus-leaf', 'Eco Cactus', ['eco', 'green', 'sustainable', 'cactus', 'cactus'], [body('M8 18V5.5a1.5 1.5 0 0 1 3 0V18Z'), line('M8 12H6a1.5 1.5 0 0 1-1.5-1.5V8.5M11 10h2a1.5 1.5 0 0 0 1.5-1.5V7'), line('M5 18h9'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('mushroom-leaf', 'Eco Mushroom', ['eco', 'green', 'sustainable', 'mushroom', 'mushroom'], [body('M3.5 10.5a6 6 0 0 1 12 0Z'), body('M7.5 10.7h4v5.3a2 2 0 0 1-4 0Z'), line(D(7, 7.5) + D(11.5, 6.8)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('feather-leaf', 'Eco Feather', ['eco', 'green', 'sustainable', 'feather', 'feather'], [body('M15 3.5c-5 0-9 4-9 9.5v2h2.3c5.7 0 6.7-5.6 6.7-11.5Z'), line('M3.8 17.8 11.5 8'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('tulip-leaf', 'Eco Tulip', ['eco', 'green', 'sustainable', 'tulip', 'tulip'], [body('M5.5 4.5l2 1.8 2-2.3 2 2.3 2-1.8V8a4 4 0 0 1-8 0Z'), line('M9.5 12.2V18'), line('M9.5 16c-1.5-2-3.2-2.5-4.8-2.3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('sprout-leaf', 'Eco Sprout', ['eco', 'green', 'sustainable', 'sprout', 'sprout'], [body('M9.2 10.3C9.2 7 7.4 5 4 5c0 3.4 1.8 5.3 5.2 5.3Z'), body('M9.8 8.8c0-3 1.8-4.8 5.2-4.8 0 3-1.8 4.8-5.2 4.8Z'), line('M9.5 11v7M6 18h7'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('waves-leaf', 'Eco Waves', ['eco', 'green', 'sustainable', 'waves', 'waves'], [line('M3 7c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0M3 11c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0M3 15c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
