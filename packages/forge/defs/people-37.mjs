import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'people',
  icons: [
    icon('users-upload', 'Upload Team', ['upload', 'send', 'export', 'team', 'users'], [body(C(7, 8, 2.5)), line('M3 16c0-2.5 1.8-4 4-4s4 1.5 4 4M11.5 5a2.2 2.2 0 1 1 0 4.4M12.5 12c1.6.4 2.5 1.7 2.5 3.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('user-upload', 'Upload User', ['upload', 'send', 'export', 'user', 'user'], [body(C(9.5, 8, 3.5)), body(translateD('M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z', -2.5, 0)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('baby-bottle-upload', 'Upload Baby Bottle', ['upload', 'send', 'export', 'baby bottle', 'baby-bottle'], [body('M8 3.5h3v2l1.5 2V16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 16V7.5L8 5.5Z'), line('M6.7 10.5h5.6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('stroller-upload', 'Upload Stroller', ['upload', 'send', 'export', 'stroller', 'stroller'], [body('M4 9.5A5.5 5.5 0 0 1 9.5 4v5.5Z'), body('M3.5 10.5h12a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z'), line('M15.5 10.5l1-4'), line(C(6, 17, 1.5) + C(13, 17, 1.5)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('swing-upload', 'Upload Swing', ['upload', 'send', 'export', 'swing', 'swing'], [line('M3 18V5h13v13'), line('M7.5 5.2v8M11.5 5.2v8'), body(R(6.5, 13, 6, 2, 0.7)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('lips-upload', 'Upload Lips', ['upload', 'send', 'export', 'lips', 'lips'], [body('M3 10.5c1.5-2.5 3.5-4 5-4 .6 0 1 .4 1.5.8.5-.4.9-.8 1.5-.8 1.5 0 3.5 1.5 5 4-2 3-4 4.5-6.5 4.5S5 13.5 3 10.5Z'), line('M3.4 10.5h12.2'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('seesaw-upload', 'Upload Seesaw', ['upload', 'send', 'export', 'seesaw', 'seesaw'], [line('M3 9.5 16 5.5'), body('M9.5 7.5 12 14H7Z'), line('M3 15h13'), line(C(4, 7.3, 1.3) + C(15, 3.3, 1.3)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('slide-upload', 'Upload Playground Slide', ['upload', 'send', 'export', 'playground slide', 'slide'], [line('M4 18V6h3v12M4 9.5h3M4 13h3'), line('M7 6c3 0 4 2.5 5.5 6s2.5 6 4 6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
