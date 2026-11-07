import { R, C, L, A, poly, D, star, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const rot = (d) => rotateD(d, 45, 12, 12);
const hex = Array.from({ length: 6 }, (_, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return [12 + 8.8 * Math.cos(a), 12 + 8.8 * Math.sin(a)];
});

export default {
  category: 'gaming',
  icons: [
    icon('sword', 'Sword', ['weapon', 'attack', 'battle', 'rpg', 'fight'], [body(rot(poly([[10.6, 13], [10.6, 4.5], [12, 3], [13.4, 4.5], [13.4, 13]], 0.4, true))), line(rot(L(8, 13.6, 16, 13.6))), line(rot(L(12, 14, 12, 18.3))), body(rot(C(12, 19.6, 1.2)))], { noAccent: true }),
    icon('potion', 'Potion', ['elixir', 'magic', 'health potion', 'rpg', 'brew'], [line(L(9, 3.5, 15, 3.5)), body('M10 3.5h4v5.2a6 6 0 1 1-4 0Z'), accent(L(8.5, 15, 15.5, 15))]),
    icon('treasure-chest', 'Treasure Chest', ['loot', 'reward', 'chest', 'treasure', 'rpg'], [body('M3.5 10a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v10.5h-17Z'), line(L(3.7, 11, 20.3, 11)), body(R(10.5, 9.5, 3, 3.5, 0.8))], { noAccent: true }),
    icon('dice-d20', 'D20', ['dice', 'tabletop', 'rpg', 'roll', 'polyhedral'], [body(poly(hex, 1, true)), line(poly([[12, 7], [16.3, 14.5], [7.7, 14.5]], 0.4, true)), line(L(12, 3.2, 12, 7)), line(L(16.3, 14.5, 19.6, 16.4)), line(L(7.7, 14.5, 4.4, 16.4))], { noAccent: true, anim: 'spin' }),
    icon('arcade', 'Arcade', ['arcade machine', 'retro', 'cabinet', 'coin-op'], [body('M6 20.5V9l1.5-5.5h9L18 9v11.5Z'), line(R(8.5, 6.5, 7, 5, 1)), line('M10 17v-2.5'), line(D(10, 14.2)), accent(D(14, 15.5))]),
    icon('handheld-console', 'Handheld Console', ['portable game', 'handheld', 'gameboy', 'retro'], [body(R(6, 3, 12, 18, 3)), line(R(8.5, 5.5, 7, 6, 1)), line('M9.5 16h3M11 14.5v3'), accent(D(15, 15.5))]),
    icon('bomb', 'Bomb', ['explosive', 'boom', 'danger', 'game'], [body(C(11, 14, 6.5)), line('M15.6 9.4 17.5 7.5a2 2 0 0 1 2.5-.5'), line(star(19.6, 4.8, 1.6, 0.55, 4, 0.2)), accent(A(11, 14, 4, 200, 250))], { anim: 'wiggle' }),
  ],
};
