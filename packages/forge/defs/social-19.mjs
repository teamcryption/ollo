import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'social',
  icons: [
    icon('hashtag-hourglass', 'Hashtag Timer', ['timer', 'waiting', 'countdown', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('thumbs-up-hourglass', 'Thumbs Up Timer', ['timer', 'waiting', 'countdown', 'thumbs up', 'thumbs-up'], [body('M6 9.5 9 3.5c1 0 2 .7 2 2V8h3.5a1.5 1.5 0 0 1 1.5 1.8l-1 6a1.5 1.5 0 0 1-1.5 1.2H6Z'), body(R(2.5, 9.5, 3, 7.5, 0.8)), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('wave-hand-hourglass', 'Wave Timer', ['timer', 'waiting', 'countdown', 'wave', 'wave-hand'], [body('M7 18c-2.5-1-4-3.5-4-6V8.5a1 1 0 0 1 2 0V11V5a1 1 0 0 1 2 0v5.5V4a1 1 0 0 1 2 0v6.5V5a1 1 0 0 1 2 0v6.5l1-1.5a1 1 0 0 1 1.7 1L12.5 15c-1 2-3 3-5.5 3Z'), line('M14.5 3c1 .5 1.7 1.3 2 2.5'), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('peace-hand-hourglass', 'Peace Timer', ['timer', 'waiting', 'countdown', 'peace', 'peace-hand'], [body('M6 18c-1.5-1-2.5-2.5-2.5-4.5v-2a1.5 1.5 0 0 1 3 0V12L5.5 4.5a1 1 0 0 1 2-.3l1.5 6 1.5-6a1 1 0 0 1 2 .3l-1 7.5h1a2 2 0 0 1 2 2v.5c0 2-1.5 3.5-3.5 3.5Z'), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('hashtag-trophy', 'Hashtag Award', ['award', 'winner', 'achievement', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body('M14 12.8h6v2.7a3 3 0 0 1-6 0Z', { cover: true }), line('M17 18.5v1.7M15 20.6h4M14 13.8h-1v.6a1.6 1.6 0 0 0 1.4 1.6M20 13.8h1v.6a1.6 1.6 0 0 1-1.4 1.6')], { noAccent: true }),
  ],
};
