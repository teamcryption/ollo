import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('database-heart', 'Favourite Database', ['favourite', 'saved', 'like', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('database-user', 'Database Account', ['user', 'account', 'profile', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('database-bell', 'Database Notification', ['notification', 'reminder', 'alert', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('database-cloud', 'Cloud Database', ['cloud', 'sync', 'online', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('database-chat', 'Database Chat', ['chat', 'support', 'message', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('database-pencil', 'Edit Database', ['edit', 'write', 'modify', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
