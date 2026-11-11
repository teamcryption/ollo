import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('plant-sparkle', 'AI Plant', ['ai', 'smart', 'magic', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('mountain-sparkle', 'AI Mountain', ['ai', 'smart', 'magic', 'mountain', 'mountain'], [body(poly([[2.5, 16.5], [7.5, 7], [10, 11], [12, 8], [16.5, 16.5]], 0.8, true)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('leaf-sparkle', 'AI Leaf', ['ai', 'smart', 'magic', 'leaf', 'leaf'], [body('M4 16c0-6.5 4-11 11-12 .5 7-3.5 12-10 12Z'), line('M4.5 15.5 11 9'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('sun-sparkle', 'AI Sun', ['ai', 'smart', 'magic', 'sun', 'sun'], [body(C(9.5, 10.5, 3.2)), line('M9.5 3.5V5M9.5 16v1.5M2.5 10.5H4M15 10.5h1.5M4.6 5.6l1 1M13.4 14.4l1 1M14.4 5.6l-1 1M5.6 14.4l-1 1'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('tree-sparkle', 'AI Tree', ['ai', 'smart', 'magic', 'tree', 'tree'], [body('M9.5 3c3 0 5 2.3 5 5 0 2.5-2 4.5-5 4.5s-5-2-5-4.5c0-2.7 2-5 5-5Z'), line('M9.5 12.5V18M7 18h5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('flower-sparkle', 'AI Flower', ['ai', 'smart', 'magic', 'flower', 'flower'], [body(C(9.5, 7, 3.5)), line(C(9.5, 7, 1.2)), line('M9.5 10.5v7.5M9.5 15c-1.3-1.6-2.8-2-4.3-1.8'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('flame-sparkle', 'AI Fire', ['ai', 'smart', 'magic', 'fire', 'flame'], [body('M9.5 3.5c3 2.8 5 5.3 5 8.5a5 5 0 0 1-10 0c0-2 1-3.5 2.3-4.8.3 1.5 1 2.5 2 2.8-.4-2.5.2-4.6.7-6.5Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('cactus-sparkle', 'AI Cactus', ['ai', 'smart', 'magic', 'cactus', 'cactus'], [body('M8 18V5.5a1.5 1.5 0 0 1 3 0V18Z'), line('M8 12H6a1.5 1.5 0 0 1-1.5-1.5V8.5M11 10h2a1.5 1.5 0 0 0 1.5-1.5V7'), line('M5 18h9'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('mushroom-sparkle', 'AI Mushroom', ['ai', 'smart', 'magic', 'mushroom', 'mushroom'], [body('M3.5 10.5a6 6 0 0 1 12 0Z'), body('M7.5 10.7h4v5.3a2 2 0 0 1-4 0Z'), line(D(7, 7.5) + D(11.5, 6.8)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('feather-sparkle', 'AI Feather', ['ai', 'smart', 'magic', 'feather', 'feather'], [body('M15 3.5c-5 0-9 4-9 9.5v2h2.3c5.7 0 6.7-5.6 6.7-11.5Z'), line('M3.8 17.8 11.5 8'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('pine-sparkle', 'AI Pine Tree', ['ai', 'smart', 'magic', 'pine tree', 'pine'], [body(poly([[9.5, 3], [14.5, 9.5], [12, 9.5], [15.5, 15], [3.5, 15], [7, 9.5], [4.5, 9.5]], 0.7, true)), line('M9.5 15.2v3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('volcano-sparkle', 'AI Volcano', ['ai', 'smart', 'magic', 'volcano', 'volcano'], [line('M8.5 5.5c-.5-1 .5-1.5 0-2.5M11 5.5c.5-1-.5-1.5 0-2.5'), body(poly([[3, 17.5], [7, 7.5], [12, 7.5], [16, 17.5]], 0.8, true)), line('M7.3 8l1.2 2.6 1-1.2 1 1.2 1.2-2.6'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('tulip-sparkle', 'AI Tulip', ['ai', 'smart', 'magic', 'tulip', 'tulip'], [body('M5.5 4.5l2 1.8 2-2.3 2 2.3 2-1.8V8a4 4 0 0 1-8 0Z'), line('M9.5 12.2V18'), line('M9.5 16c-1.5-2-3.2-2.5-4.8-2.3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('sprout-sparkle', 'AI Sprout', ['ai', 'smart', 'magic', 'sprout', 'sprout'], [body('M9.2 10.3C9.2 7 7.4 5 4 5c0 3.4 1.8 5.3 5.2 5.3Z'), body('M9.8 8.8c0-3 1.8-4.8 5.2-4.8 0 3-1.8 4.8-5.2 4.8Z'), line('M9.5 11v7M6 18h7'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('seashell-sparkle', 'AI Seashell', ['ai', 'smart', 'magic', 'seashell', 'seashell'], [body('M3.5 10a6 6 0 0 1 12 0c0 2.5-1.5 4.5-3.5 5.5H7C5 14.5 3.5 12.5 3.5 10Z'), line('M9.5 15.2V4.4M7.2 15 5.6 6.8M11.8 15l1.6-8.2'), body(R(7, 16.2, 5, 2, 0.8)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('birdhouse-sparkle', 'AI Birdhouse', ['ai', 'smart', 'magic', 'birdhouse', 'birdhouse'], [body(poly([[9.5, 3], [16, 8.5], [3, 8.5]], 0.8, true)), body(R(4.5, 9.5, 10, 8.5, 1)), line(C(9.5, 12.6, 1.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('pinecone-sparkle', 'AI Pinecone', ['ai', 'smart', 'magic', 'pinecone', 'pinecone'], [body('M9.5 3.5c3 2 5 5 5 8 0 3.5-2.2 6-5 6s-5-2.5-5-6c0-3 2-6 5-8Z'), line('M6.2 9.5l3.3 2 3.3-2M5.2 13l4.3 2.5 4.3-2.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('waves-sparkle', 'AI Waves', ['ai', 'smart', 'magic', 'waves', 'waves'], [line('M3 7c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0M3 11c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0M3 15c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('lotus-sparkle', 'AI Lotus', ['ai', 'smart', 'magic', 'lotus', 'lotus'], [body('M9.5 5c1.8 2 2.5 4.5 2 7.5-.4 1.6-1.1 3-2 4-.9-1-1.6-2.4-2-4-.5-3 .2-5.5 2-7.5Z'), line('M7.2 15.5C4.8 15 3.3 13 3 9.5c1.6.3 2.8 1 3.8 2M11.8 15.5c2.4-.5 3.9-2.5 4.2-6-1.6.3-2.8 1-3.8 2'), line('M4.5 17.8h10'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
