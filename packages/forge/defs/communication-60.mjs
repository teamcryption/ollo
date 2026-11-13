import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('mail-2', 'Mail Alt', ['email', 'envelope', 'message', 'inbox'], [body(R(3, 5.5, 18, 13, 2.5)), line('M3.5 7.5 12 13l8.5-5.5'), accent(L(6, 16, 9, 16))]),
    icon('mail-3', 'Mail Open Flap', ['email', 'envelope', 'letter', 'post'], [body('M3 10l9-6 9 6v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19Z'), line('M3.5 10.5l8.5 5.5 8.5-5.5'), accent(L(10.5, 8, 13.5, 8))]),
    icon('chat-2', 'Chat Rounded', ['message', 'conversation', 'comment', 'talk'], [body('M12 4c4.7 0 8.5 3.1 8.5 7s-3.8 7-8.5 7c-1 0-2-.1-2.9-.4L5 19.5l1.2-3.5C4.6 14.7 3.5 13 3.5 11c0-3.9 3.8-7 8.5-7Z'), accent(L(9, 11, 15, 11))]),
    icon('chat-3', 'Chat Square', ['message', 'conversation', 'comment', 'support'], [body('M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4 4v-4h-.5A1.5 1.5 0 0 1 4 14.5Z'), line(L(8, 8.5, 16, 8.5)), accent(L(8, 11.5, 12, 11.5))]),
    icon('chat-4', 'Chat Double', ['messages', 'conversation', 'chat', 'thread'], [body('M3.5 5.5A1.5 1.5 0 0 1 5 4h9a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 14 13H8.5l-3 3v-3H5a1.5 1.5 0 0 1-1.5-1.5Z'), line('M18 8.5h1a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-.5v3l-3-3H11'), accent(L(7, 8.5, 11, 8.5))]),
    icon('phone-2', 'Phone Alt', ['call', 'telephone', 'contact', 'dial'], [body('M5 4h3l1.5 4-2 1.5a10 10 0 0 0 7 7L16 14.5l4 1.5v3a1.5 1.5 0 0 1-1.5 1.5C10.5 20.5 3.5 13.5 3.5 5.5A1.5 1.5 0 0 1 5 4Z'), accent('M15 4.5a5 5 0 0 1 4.5 4.5')]),
  ],
};
