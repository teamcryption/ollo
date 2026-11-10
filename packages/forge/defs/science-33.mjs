import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('comet-search', 'Search Comet', ['search', 'find', 'lookup', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('comet-clock', 'Comet Schedule', ['schedule', 'time', 'history', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('comet-shield', 'Comet Protection', ['protected', 'secure', 'safety', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('comet-gear', 'Comet Settings', ['settings', 'configure', 'preferences', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('comet-pin', 'Comet Location', ['location', 'place', 'map', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('comet-bolt', 'Instant Comet', ['quick', 'fast', 'instant', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('comet-heart', 'Favourite Comet', ['favourite', 'saved', 'like', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('comet-star', 'Featured Comet', ['featured', 'top rated', 'best', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('comet-alert', 'Comet Alert', ['alert', 'warning', 'problem', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('comet-user', 'Comet Account', ['user', 'account', 'profile', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('comet-bell', 'Comet Notification', ['notification', 'reminder', 'alert', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('comet-cloud', 'Cloud Comet', ['cloud', 'sync', 'online', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('comet-chat', 'Comet Chat', ['chat', 'support', 'message', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('comet-download', 'Download Comet', ['download', 'save', 'export', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('comet-pencil', 'Edit Comet', ['edit', 'write', 'modify', 'comet', 'comet'], [line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
