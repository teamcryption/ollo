import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('flag-fire', 'Trending Flag', ['trending', 'hot', 'popular', 'flag', 'flag'], [line('M4.5 19V4'), body('M5 4.5h9l-1.5 3 1.5 3H5Z'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('trash-fire', 'Trending Trash', ['trending', 'hot', 'popular', 'trash', 'trash'], [line('M3.5 6h12M7.5 6V4.5h4V6'), body('M5 6.5h9l-.8 10a1.5 1.5 0 0 1-1.5 1.4H7.3a1.5 1.5 0 0 1-1.5-1.4Z'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('idcard-fire', 'Trending ID Card', ['trending', 'hot', 'popular', 'id card', 'idcard'], [body(R(4, 3.5, 11, 14, 2)), line(C(9.5, 8.5, 2)), line('M6.5 14a3 3 0 0 1 6 0'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('firstaid-fire', 'Trending First Aid', ['trending', 'hot', 'popular', 'first aid', 'firstaid'], [line('M7.5 6V4.5h4V6'), body(R(3.5, 6, 12, 10, 2)), line('M9.5 8.8v4.4M7.3 11h4.4'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('hourglass-fire', 'Trending Timer', ['trending', 'hot', 'popular', 'timer', 'hourglass'], [line('M5.5 3.5h8M5.5 17.5h8'), body('M6.5 3.7h6v2.3l-3 4.5 3 4.5v2.3h-6V15l3-4.5-3-4.5Z'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('pushpin-fire', 'Trending Pushpin', ['trending', 'hot', 'popular', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('power-fire', 'Trending Power', ['trending', 'hot', 'popular', 'power', 'power'], [line('M9.5 3.5v6'), line('M5.5 6.5a6 6 0 1 0 8 0'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('list-fire', 'Trending List', ['trending', 'hot', 'popular', 'list', 'list'], [line('M7 6h8.5M7 10.5h8.5M7 15h8.5'), line(D(4, 6) + D(4, 10.5) + D(4, 15)), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('toggle-fire', 'Trending Toggle', ['trending', 'hot', 'popular', 'toggle', 'toggle'], [body(R(3, 7.5, 13, 7, 3.5)), line(C(12.5, 11, 2)), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('browser-fire', 'Trending Browser', ['trending', 'hot', 'popular', 'browser', 'browser'], [body(R(3, 4.5, 13, 12, 1.8)), line('M3.2 8h12.6'), line(D(5.5, 6.2) + D(7.5, 6.2)), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('sticky-note-fire', 'Trending Sticky Note', ['trending', 'hot', 'popular', 'sticky note', 'sticky-note'], [body('M4 4h11v7.5L11.5 15H4Z'), line('M11.5 14.8v-3.3h3.3'), line('M6.5 7.5h5'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
  ],
};
