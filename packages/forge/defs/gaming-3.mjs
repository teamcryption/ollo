import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('game-cartridge', 'Game Cartridge', ['cartridge', 'retro game', 'cart', 'console game', 'rom'], [body('M6.5 3.5h11V17L16 18.5v2H8v-2L6.5 17Z'), accent(R(9, 6.5, 6, 5.5, 1)), line(L(9.5, 15, 14.5, 15))]),
  ],
};
