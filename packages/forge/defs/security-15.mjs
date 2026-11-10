import { icon, body, line } from '../src/dsl.mjs';
import { R, D, poly } from '../src/geo.mjs';

// Small padlock in front, bottom right: "locked / private X".
const LOCK = [line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })];
const SH = body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true });
const t = ['locked', 'private', 'secure', 'encrypted'];

export default {
  category: 'security',
  icons: [
    icon('cloud-lock', 'Private Cloud', ['secure storage', 'encrypted cloud', ...t], [body('M6.5 15a3.5 3.5 0 0 1-.4-7 5 5 0 0 1 9.6 1.1A3 3 0 0 1 15.5 15Z'), ...LOCK], { noAccent: true }),
    icon('calendar-lock', 'Private Event', ['private calendar', 'busy', 'hidden event', ...t], [body(R(3, 5, 13.5, 12.5, 2.5)), line('M3.2 9h13.1M6.5 3.5v3M13 3.5v3'), ...LOCK], { noAccent: true }),
    icon('image-lock', 'Private Photo', ['hidden photo', 'locked album', 'private gallery', ...t], [body(R(3, 4, 14, 11.5, 2)), line('M5.5 12.5l2.8-2.8 2.2 2.2'), line(D(13, 7.5)), ...LOCK], { noAccent: true }),
    icon('card-lock', 'Card Frozen', ['freeze card', 'block card', 'card locked', ...t], [body(R(3, 5, 15, 10, 2)), line('M3.2 8.5h14.6'), ...LOCK], { noAccent: true }),
    icon('smartphone-lock', 'Phone Locked', ['screen lock', 'device lock', 'pin lock', ...t], [body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5'), ...LOCK], { noAccent: true }),
    icon('mail-lock', 'Encrypted Email', ['secure mail', 'private message', 'pgp', ...t], [body(R(3, 5, 14.5, 11, 2)), line('M5.5 8l4.75 3 4.75-3'), ...LOCK], { noAccent: true }),
    icon('note-lock', 'Private Note', ['locked note', 'secret note', 'hidden memo', ...t], [body(R(3.5, 3.5, 12, 15, 2)), line('M6.5 7.5h6M6.5 10.5h6M6.5 13.5h3'), ...LOCK], { noAccent: true }),
    icon('cart-shield', 'Purchase Protection', ['buyer protection', 'safe checkout', 'secure shopping', 'protected', 'guarantee'], [line('M3 4.5h1.8l1.8 8.5h7.2l1.4-5.5H5.6'), line('M7 16.5h.01M12.5 16.5h.01'), SH], { noAccent: true }),
  ],
};
