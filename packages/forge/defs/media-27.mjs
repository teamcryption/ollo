import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('playback-speed', 'Playback Speed', ['speed', 'faster', 'tempo', 'video', 'audio'], [line('M4.5 16a7.5 7.5 0 0 1 15 0'), body(poly([[10.5, 10.5], [14.5, 13], [10.5, 15.5]], 0.6, true)), accent('M4.5 19.5h15')]),
    icon('repeat-one', 'Repeat One', ['loop track', 'repeat song', 'music', 'playback', 'single'], [line('M5.5 11V9.5a2 2 0 0 1 2-2H17M15 5l2.5 2.5L15 10M18.5 13v1.5a2 2 0 0 1-2 2H7M9 19l-2.5-2.5L9 14'), accent('M11.2 11.3l1-.8v4')]),
  ],
};
