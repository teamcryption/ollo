import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('pushpin-search', 'Search Pushpin', ['search', 'find', 'lookup', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('pushpin-clock', 'Pushpin Schedule', ['schedule', 'time', 'history', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('pushpin-shield', 'Pushpin Protection', ['protected', 'secure', 'safety', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('pushpin-gear', 'Pushpin Settings', ['settings', 'configure', 'preferences', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('pushpin-pin', 'Pushpin Location', ['location', 'place', 'map', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('pushpin-bolt', 'Instant Pushpin', ['quick', 'fast', 'instant', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pushpin-heart', 'Favourite Pushpin', ['favourite', 'saved', 'like', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('pushpin-star', 'Featured Pushpin', ['featured', 'top rated', 'best', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('pushpin-alert', 'Pushpin Alert', ['alert', 'warning', 'problem', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('pushpin-user', 'Pushpin Account', ['user', 'account', 'profile', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('pushpin-bell', 'Pushpin Notification', ['notification', 'reminder', 'alert', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('pushpin-cloud', 'Cloud Pushpin', ['cloud', 'sync', 'online', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('pushpin-chat', 'Pushpin Chat', ['chat', 'support', 'message', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('pushpin-download', 'Download Pushpin', ['download', 'save', 'export', 'pushpin', 'pushpin'], [body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
  ],
};
