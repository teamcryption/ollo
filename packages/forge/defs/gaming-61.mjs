import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('domino-pricing', 'Domino Pricing', ['pricing', 'cost', 'money', 'domino', 'domino'], [body(R(5.5, 3, 8, 15.5, 2)), line('M5.7 10.75h7.6'), line(D(8, 5.8) + D(9.5, 7.3) + D(11, 8.8) + D(8, 13.5) + D(11, 13.5)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('building-blocks-pricing', 'Building Blocks Pricing', ['pricing', 'cost', 'money', 'building blocks', 'building-blocks'], [body(R(3, 11, 6, 6, 0.8)), body(R(10, 11, 6, 6, 0.8)), body(poly([[9.5, 3.5], [13, 9.5], [6, 9.5]], 0.6, true)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('handheld-console-pricing', 'Handheld Console Pricing', ['pricing', 'cost', 'money', 'handheld console', 'handheld-console'], [body(R(4.5, 3, 10, 15, 2)), line(R(6.3, 5, 6.4, 5, 0.6)), line('M7 13.5h2M8 12.5v2'), line(D(11.5, 13) + D(12.5, 14.5)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('gamepad-notice', 'Game Notice', ['notice', 'important', 'attention', 'game', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
