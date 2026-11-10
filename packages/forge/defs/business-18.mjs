import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('briefcase-clock', 'Work Hours', ['office hours', 'shift', 'working time', 'job', 'briefcase'], [line('M7 7.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 12 6v1.5'), body(R(3, 7.5, 13, 10, 2)), line('M3.2 11.5h12.6'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('briefcase-gear', 'Business Settings', ['company settings', 'workspace', 'manage business', 'job', 'briefcase'], [line('M7 7.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 12 6v1.5'), body(R(3, 7.5, 13, 10, 2)), line('M3.2 11.5h12.6'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('briefcase-lock', 'Confidential', ['private business', 'locked portfolio', 'secure work', 'job', 'briefcase'], [line('M7 7.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 12 6v1.5'), body(R(3, 7.5, 13, 10, 2)), line('M3.2 11.5h12.6'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('briefcase-star', 'Top Job', ['featured job', 'best offer', 'recommended role', 'job', 'briefcase'], [line('M7 7.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 12 6v1.5'), body(R(3, 7.5, 13, 10, 2)), line('M3.2 11.5h12.6'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('briefcase-heart', 'Saved Jobs', ['job wishlist', 'favourite roles', 'liked jobs', 'job', 'briefcase'], [line('M7 7.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 12 6v1.5'), body(R(3, 7.5, 13, 10, 2)), line('M3.2 11.5h12.6'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('flag-clock', 'Deadline', ['due date', 'cutoff', 'time limit', 'milestone', 'flag'], [line('M4.5 19V4'), body('M5 4.5h9l-1.5 3 1.5 3H5Z'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('lightbulb-search', 'Research Idea', ['discover idea', 'explore', 'insight search', 'innovation', 'lightbulb'], [body('M7 13.5v-1c0-.8-.4-1.4-1-2a4.6 4.6 0 1 1 6.5 0c-.6.6-1 1.2-1 2v1Z'), line('M7.3 16h3.9'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('lightbulb-heart', 'Favourite Idea', ['loved idea', 'best idea', 'inspiration', 'innovation', 'lightbulb'], [body('M7 13.5v-1c0-.8-.4-1.4-1-2a4.6 4.6 0 1 1 6.5 0c-.6.6-1 1.2-1 2v1Z'), line('M7.3 16h3.9'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('lightbulb-star', 'Bright Idea', ['top idea', 'featured concept', 'inspiration', 'innovation', 'lightbulb'], [body('M7 13.5v-1c0-.8-.4-1.4-1-2a4.6 4.6 0 1 1 6.5 0c-.6.6-1 1.2-1 2v1Z'), line('M7.3 16h3.9'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
