import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('key-capslock', 'Caps Lock', ['caps lock', 'keyboard', 'uppercase', 'modifier', 'key'], [line('M12 4 4.5 11.5h4V16h7v-4.5h4ZM8.5 19.5h7')], { noAccent: true }),
    icon('key-option', 'Option Key', ['alt', 'option', 'keyboard', 'modifier', 'key'], [line('M4 7h4.5l7 10H20M14 7h6')], { noAccent: true }),
    icon('key-space', 'Space Bar', ['space', 'spacebar', 'keyboard', 'blank', 'key'], [line('M4.5 12v4h15v-4')], { noAccent: true }),
    icon('eject', 'Eject', ['eject disc', 'remove', 'unmount', 'media', 'open tray'], [body(poly([[12, 5], [19, 13], [5, 13]], 1, true)), body(R(5, 16, 14, 2.5, 1.25))], { noAccent: true }),
  ],
};
