import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('inbox-clock', 'Snoozed', ['snooze mail', 'later', 'remind me', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('inbox-star', 'Priority Inbox', ['important mail', 'starred', 'focused', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('inbox-search', 'Search Mail', ['find email', 'mail search', 'lookup', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('inbox-lock', 'Secure Inbox', ['encrypted mail', 'private inbox', 'protected', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('inbox-gear', 'Inbox Settings', ['mail settings', 'filters', 'rules', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
  ],
};
