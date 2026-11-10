import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'notifications',
  icons: [
    icon('bell-gear', 'Notification Settings', ['alert settings', 'notification preferences', 'configure', 'bell', 'bell'], [body('M5.2 17.5h13.6l-1.3-2.1v-4.6a5.5 5.5 0 0 0-11 0v4.6Z'), line(L(10.5, 20.2, 13.5, 20.2)), line(L(12, 3.5, 12, 4.2)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('bell-heart', 'Liked Alerts', ['favourite notifications', 'reactions', 'alerts', 'bell', 'bell'], [body('M5.2 17.5h13.6l-1.3-2.1v-4.6a5.5 5.5 0 0 0-11 0v4.6Z'), line(L(10.5, 20.2, 13.5, 20.2)), line(L(12, 3.5, 12, 4.2)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
  ],
};
