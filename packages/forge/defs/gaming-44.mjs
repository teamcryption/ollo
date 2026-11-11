import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('gamepad-sparkle', 'AI Game', ['ai', 'smart', 'magic', 'game', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('dice-sparkle', 'AI Dice', ['ai', 'smart', 'magic', 'dice', 'dice'], [body(R(3.5, 4.5, 12, 12, 2.5)), line(D(6.8, 7.8) + D(9.5, 10.5) + D(12.2, 13.2) + D(12.2, 7.8) + D(6.8, 13.2)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('pawn-sparkle', 'AI Chess', ['ai', 'smart', 'magic', 'chess', 'pawn'], [line(C(9.5, 5.5, 2)), body('M7.5 9h4l-.8 1.5c0 2 .8 3.5 2.3 5h-7c1.5-1.5 2.3-3 2.3-5Z'), line('M4.5 18h10'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('joystick-sparkle', 'AI Joystick', ['ai', 'smart', 'magic', 'joystick', 'joystick'], [body(C(9.5, 5.8, 2.5)), line('M9.5 8.5v4.8'), body(R(3.5, 13.5, 12, 4.5, 1.5)), line('M5.8 15.75h1'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('playing-card-sparkle', 'AI Playing Card', ['ai', 'smart', 'magic', 'playing card', 'playing-card'], [body(R(4.5, 3.5, 10, 14, 1.8)), line('M9.5 7.5c1.5 1.4 2.8 2.4 2.8 3.6a1.4 1.4 0 0 1-2.5.9l.4 1.5H8.8l.4-1.5a1.4 1.4 0 0 1-2.5-.9c0-1.2 1.3-2.2 2.8-3.6Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('domino-sparkle', 'AI Domino', ['ai', 'smart', 'magic', 'domino', 'domino'], [body(R(5.5, 3, 8, 15.5, 2)), line('M5.7 10.75h7.6'), line(D(8, 5.8) + D(9.5, 7.3) + D(11, 8.8) + D(8, 13.5) + D(11, 13.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('sword-sparkle', 'AI Sword', ['ai', 'smart', 'magic', 'sword', 'sword'], [body(rotateD('M8.6 2.8h1.8l.4 9.7H8.2Z', 45, 9.5, 10.5)), line(rotateD('M6.3 12.9h6.4', 45, 9.5, 10.5)), line(rotateD('M9.5 13.2v3.6', 45, 9.5, 10.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('treasure-chest-sparkle', 'AI Treasure Chest', ['ai', 'smart', 'magic', 'treasure chest', 'treasure-chest'], [body('M3.5 9V7.5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9Z'), body(R(3.5, 10.2, 12, 7.8, 1.2)), line('M9.5 11.8v2.2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('bomb-sparkle', 'AI Bomb', ['ai', 'smart', 'magic', 'bomb', 'bomb'], [line('M12.3 8.2c.5-1.5 1.5-2.5 3-3'), body(C(8.5, 12.3, 5.5)), line('M6 10.2a3 3 0 0 1 2-2'), line('M16 3v1.2M17.3 4.5h-1.2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('potion-sparkle', 'AI Potion', ['ai', 'smart', 'magic', 'potion', 'potion'], [line('M7.5 3.5h4'), line('M8 7.7V4h3v3.7'), body(C(9.5, 12.5, 5)), line('M5 12.5h9'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('teddy-sparkle', 'AI Teddy Bear', ['ai', 'smart', 'magic', 'teddy bear', 'teddy'], [body(C(5.5, 5, 1.8)), body(C(13.5, 5, 1.8)), body(C(9.5, 10, 5)), line(E(9.5, 12, 2, 1.5)), line(D(7.5, 8.8) + D(11.5, 8.8)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('spinning-top-sparkle', 'AI Spinning Top', ['ai', 'smart', 'magic', 'spinning top', 'spinning-top'], [line('M9.5 5.5V3'), body('M4 9a5.5 3.5 0 0 1 11 0Z'), body('M3.5 10.2h12l-6 7.8Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('lego-brick-sparkle', 'AI Toy Brick', ['ai', 'smart', 'magic', 'toy brick', 'lego-brick'], [body(R(5, 4, 3, 2.5, 0.6)), body(R(11, 4, 3, 2.5, 0.6)), body(R(3.5, 7, 12, 8, 1.2)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('rook-sparkle', 'AI Rook', ['ai', 'smart', 'magic', 'rook', 'rook'], [body(poly([[5, 4], [7, 4], [7, 5.5], [8.5, 5.5], [8.5, 4], [10.5, 4], [10.5, 5.5], [12, 5.5], [12, 4], [14, 4], [14, 8], [12.5, 9], [13, 14.5], [6, 14.5], [6.5, 9], [5, 8]], 0.4, true)), body(R(4, 15.5, 11, 2.5, 0.8)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
