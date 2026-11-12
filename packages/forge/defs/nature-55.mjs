import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('plant-upload', 'Upload Plant', ['upload', 'send', 'export', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('cactus-upload', 'Upload Cactus', ['upload', 'send', 'export', 'cactus', 'cactus'], [body('M8 18V5.5a1.5 1.5 0 0 1 3 0V18Z'), line('M8 12H6a1.5 1.5 0 0 1-1.5-1.5V8.5M11 10h2a1.5 1.5 0 0 0 1.5-1.5V7'), line('M5 18h9'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('sprout-upload', 'Upload Sprout', ['upload', 'send', 'export', 'sprout', 'sprout'], [body('M9.2 10.3C9.2 7 7.4 5 4 5c0 3.4 1.8 5.3 5.2 5.3Z'), body('M9.8 8.8c0-3 1.8-4.8 5.2-4.8 0 3-1.8 4.8-5.2 4.8Z'), line('M9.5 11v7M6 18h7'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('birdhouse-upload', 'Upload Birdhouse', ['upload', 'send', 'export', 'birdhouse', 'birdhouse'], [body(poly([[9.5, 3], [16, 8.5], [3, 8.5]], 0.8, true)), body(R(4.5, 9.5, 10, 8.5, 1)), line(C(9.5, 12.6, 1.5)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pinecone-upload', 'Upload Pinecone', ['upload', 'send', 'export', 'pinecone', 'pinecone'], [body('M9.5 3.5c3 2 5 5 5 8 0 3.5-2.2 6-5 6s-5-2.5-5-6c0-3 2-6 5-8Z'), line('M6.2 9.5l3.3 2 3.3-2M5.2 13l4.3 2.5 4.3-2.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('mountain-flag-upload', 'Upload Summit', ['upload', 'send', 'export', 'summit', 'mountain-flag'], [body(poly([[2.5, 17.5], [8, 7.5], [10.5, 11], [12.5, 8.5], [16.5, 17.5]], 0.8, true)), line('M8 7.7V3.5l2.5 1L8 5.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('acorn-upload', 'Upload Acorn', ['upload', 'send', 'export', 'acorn', 'acorn'], [line('M9.5 3.5V5'), body('M4 9a5.5 4 0 0 1 11 0Z'), body('M5 10.2h9v1c0 3.5-2 6-4.5 7-2.5-1-4.5-3.5-4.5-7Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
