import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'social',
  icons: [
    icon('hashtag-camera', 'Hashtag Photo', ['photo', 'camera', 'picture', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('thumbs-up-camera', 'Thumbs Up Photo', ['photo', 'camera', 'picture', 'thumbs up', 'thumbs-up'], [body('M6 9.5 9 3.5c1 0 2 .7 2 2V8h3.5a1.5 1.5 0 0 1 1.5 1.8l-1 6a1.5 1.5 0 0 1-1.5 1.2H6Z'), body(R(2.5, 9.5, 3, 7.5, 0.8)), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('wave-hand-camera', 'Wave Photo', ['photo', 'camera', 'picture', 'wave', 'wave-hand'], [body('M7 18c-2.5-1-4-3.5-4-6V8.5a1 1 0 0 1 2 0V11V5a1 1 0 0 1 2 0v5.5V4a1 1 0 0 1 2 0v6.5V5a1 1 0 0 1 2 0v6.5l1-1.5a1 1 0 0 1 1.7 1L12.5 15c-1 2-3 3-5.5 3Z'), line('M14.5 3c1 .5 1.7 1.3 2 2.5'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('peace-hand-camera', 'Peace Photo', ['photo', 'camera', 'picture', 'peace', 'peace-hand'], [body('M6 18c-1.5-1-2.5-2.5-2.5-4.5v-2a1.5 1.5 0 0 1 3 0V12L5.5 4.5a1 1 0 0 1 2-.3l1.5 6 1.5-6a1 1 0 0 1 2 .3l-1 7.5h1a2 2 0 0 1 2 2v.5c0 2-1.5 3.5-3.5 3.5Z'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('hashtag-filter', 'Filter Hashtag', ['filter', 'sort', 'refine', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
