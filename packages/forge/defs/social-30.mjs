import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'social',
  icons: [
    icon('hashtag-drop', 'Hashtag Water', ['water', 'liquid', 'drop', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body('M17 12.3c2 2.2 3.3 4 3.3 5.4a3.3 3.3 0 0 1-6.6 0c0-1.4 1.3-3.2 3.3-5.4Z', { cover: true })], { noAccent: true }),
    icon('hashtag-rocket', 'Launch Hashtag', ['launch', 'boost', 'startup', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body('M17 12.3c1.8 1.4 2.5 3.3 2.2 5.8l-1 1.4h-2.4l-1-1.4c-.3-2.5.4-4.4 2.2-5.8Z', { cover: true }), line('M15 18l-1.3 1.6M19 18l1.3 1.6'), line(D(17, 15.6))], { noAccent: true }),
    icon('hashtag-home', 'Home Hashtag', ['home', 'house', 'domestic', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body(poly([[17, 12.5], [21, 16], [21, 20.5], [13, 20.5], [13, 16]], 0.7, true), { cover: true }), line('M16 20.4v-2.2h2v2.2')], { noAccent: true }),
    icon('hashtag-gift', 'Hashtag Gift', ['gift', 'present', 'reward', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body(R(13, 14.8, 8, 5.7, 1), { cover: true }), line('M17 14.8v5.7M13.2 16.8h7.6'), line('M17 14.7c-.9-1.7-2.7-1.9-2.4-.5M17 14.7c.9-1.7 2.7-1.9 2.4-.5')], { noAccent: true }),
    icon('hashtag-smile', 'Hashtag Feedback', ['feedback', 'happy', 'satisfied', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body(C(17, 16.5, 4), { cover: true }), line('M15.4 17.6a2 2 0 0 0 3.2 0'), line(D(15.6, 15.4) + D(18.4, 15.4))], { noAccent: true }),
  ],
};
