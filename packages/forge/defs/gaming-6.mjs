import { R, C, poly, star } from '../src/geo.mjs';
import { icon, body, accent } from '../src/dsl.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('crystal-ball', 'Crystal Ball', ['fortune', 'magic', 'predict', 'mystic', 'future'], [body(C(12, 10, 6.8)), body(poly([[7, 17], [17, 17], [18.5, 20.5], [5.5, 20.5]], 0.5, true), { cover: true }), accent(star(10, 8.5, 2, 0.7, 4, 0.2))]),
    icon('chess-rook', 'Chess Rook', ['castle piece', 'chess', 'strategy', 'board game', 'tower'], [body('M7.5 4h2v2h1.5V4h2v2h1.5V4h2v4l-1.5 2v7H9V10L7.5 8Z'), body(R(6, 17, 12, 3.5, 1))], { noAccent: true }),
  ],
};
