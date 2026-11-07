import { R, C, L, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('dice', 'Dice', ['game', 'random', 'chance', 'board game', 'roll'], [body(R(3.5, 3.5, 17, 17, 4)), line(D(8, 8)), line(D(16, 8)), line(D(8, 16)), line(D(16, 16)), accent(D(12, 12))], { anim: 'spin' }),
    icon('joystick', 'Joystick', ['arcade', 'controller', 'game', 'retro'], [body(R(4, 15, 16, 5.5, 2)), line(L(12, 15, 12, 9.5)), body(C(12, 7, 2.8)), accent(D(16.5, 17.7))], { anim: 'wiggle' }),
    icon('chess-pawn', 'Chess Pawn', ['chess', 'strategy', 'board game', 'piece'], [body(C(12, 6.5, 2.5)), body('M9.5 10.5h5l-1 4.5 3 2.5V19h-9v-1.5l3-2.5Z'), line(L(6, 20.5, 18, 20.5))], { noAccent: true }),
    icon('playing-cards', 'Playing Cards', ['cards', 'poker', 'casino', 'game', 'deck'], [body(rotateD(R(4, 5, 10, 14, 2), -10)), body(rotateD(R(10, 5, 10, 14, 2), 10), { cover: true })], { noAccent: true }),
    icon('vr-headset', 'VR Headset', ['virtual reality', 'metaverse', 'immersive', 'goggles'], [body('M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3.5l-2-2.5h-3l-2 2.5H5a2 2 0 0 1-2-2Z'), accent(L(10.5, 10, 13.5, 10))]),
  ],
};
