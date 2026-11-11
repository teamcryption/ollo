import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('flag-sparkle', 'AI Flag', ['ai', 'smart', 'magic', 'flag', 'flag'], [line('M4.5 19V4'), body('M5 4.5h9l-1.5 3 1.5 3H5Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('bookmark-sparkle', 'AI Bookmark', ['ai', 'smart', 'magic', 'bookmark', 'bookmark'], [body('M5 3.5h8a1 1 0 0 1 1 1v14l-5-3.5L4 18.5v-14a1 1 0 0 1 1-1Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('link-sparkle', 'AI Link', ['ai', 'smart', 'magic', 'link', 'link'], [line('M7.5 11.5 11.5 7.5M6.5 9 5 10.5a2.5 2.5 0 0 0 3.5 3.5L10 12.5M10 6.5 11.5 5a2.5 2.5 0 0 1 3.5 3.5L13.5 10'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('trash-sparkle', 'AI Trash', ['ai', 'smart', 'magic', 'trash', 'trash'], [line('M3.5 6h12M7.5 6V4.5h4V6'), body('M5 6.5h9l-.8 10a1.5 1.5 0 0 1-1.5 1.4H7.3a1.5 1.5 0 0 1-1.5-1.4Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('edit-sparkle', 'AI Document', ['ai', 'smart', 'magic', 'document', 'edit'], [body(poly([[12.5, 3.5], [15.5, 6.5], [7, 15], [3.5, 16], [4.5, 12.5]], 0.8, true)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('idcard-sparkle', 'AI ID Card', ['ai', 'smart', 'magic', 'id card', 'idcard'], [body(R(4, 3.5, 11, 14, 2)), line(C(9.5, 8.5, 2)), line('M6.5 14a3 3 0 0 1 6 0'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('firstaid-sparkle', 'AI First Aid', ['ai', 'smart', 'magic', 'first aid', 'firstaid'], [line('M7.5 6V4.5h4V6'), body(R(3.5, 6, 12, 10, 2)), line('M9.5 8.8v4.4M7.3 11h4.4'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('hourglass-sparkle', 'AI Timer', ['ai', 'smart', 'magic', 'timer', 'hourglass'], [line('M5.5 3.5h8M5.5 17.5h8'), body('M6.5 3.7h6v2.3l-3 4.5 3 4.5v2.3h-6V15l3-4.5-3-4.5Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('pushpin-sparkle', 'AI Pushpin', ['ai', 'smart', 'magic', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('power-sparkle', 'AI Power', ['ai', 'smart', 'magic', 'power', 'power'], [line('M9.5 3.5v6'), line('M5.5 6.5a6 6 0 1 0 8 0'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('list-sparkle', 'AI List', ['ai', 'smart', 'magic', 'list', 'list'], [line('M7 6h8.5M7 10.5h8.5M7 15h8.5'), line(D(4, 6) + D(4, 10.5) + D(4, 15)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('toggle-sparkle', 'AI Toggle', ['ai', 'smart', 'magic', 'toggle', 'toggle'], [body(R(3, 7.5, 13, 7, 3.5)), line(C(12.5, 11, 2)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('browser-sparkle', 'AI Browser', ['ai', 'smart', 'magic', 'browser', 'browser'], [body(R(3, 4.5, 13, 12, 1.8)), line('M3.2 8h12.6'), line(D(5.5, 6.2) + D(7.5, 6.2)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('sticky-note-sparkle', 'AI Sticky Note', ['ai', 'smart', 'magic', 'sticky note', 'sticky-note'], [body('M4 4h11v7.5L11.5 15H4Z'), line('M11.5 14.8v-3.3h3.3'), line('M6.5 7.5h5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
