import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('newspaper-gear', 'News Preferences', ['topics', 'feed settings', 'personalise', 'news', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('newspaper-bolt', 'Breaking News', ['urgent news', 'live update', 'alert', 'news', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('newspaper-shield', 'Fact Checked', ['verified news', 'trusted source', 'misinformation', 'news', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('newspaper-heart', 'Saved Articles', ['favourite stories', 'read later', 'bookmarks', 'news', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('inbox-shield', 'Spam Filter', ['junk protection', 'safe inbox', 'filtering', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
