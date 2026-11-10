import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('gamepad-heart', 'Favourite Game', ['liked game', 'wishlist', 'gaming', 'controller', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('gamepad-clock', 'Playtime', ['game time', 'screen time', 'gaming session', 'controller', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('gamepad-star', 'Top Game', ['best game', 'featured', 'rated game', 'controller', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('gamepad-lock', 'Game Parental Lock', ['restricted games', 'age rating', 'parental control', 'controller', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('gamepad-search', 'Find Games', ['game search', 'browse games', 'store', 'controller', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('gamepad-gear', 'Controller Settings', ['gamepad config', 'button mapping', 'gaming', 'controller', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
  ],
};
