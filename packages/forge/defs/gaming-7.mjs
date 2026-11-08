import { C, R, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

const NOTCH = [0, 60, 120, 180, 240, 300].map((a) => {
  const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return `M${(12 + 6.2 * c).toFixed(2)} ${(12 + 6.2 * s).toFixed(2)}L${(12 + 8.5 * c).toFixed(2)} ${(12 + 8.5 * s).toFixed(2)}`;
}).join('');

export default {
  category: 'gaming',
  icons: [
    icon('poker-chip', 'Poker Chip', ['casino', 'chip', 'bet', 'gamble', 'token'], [body(C(12, 12, 8.5)), line(C(12, 12, 4.3)), line(NOTCH)], { noAccent: true }),
    icon('chess-king', 'Chess King', ['chess', 'king', 'strategy', 'board game', 'checkmate'], [line('M12 3.5V10M10 5.5h4'), body(poly([[8, 18], [9, 10], [15, 10], [16, 18]], 0.8, true)), body(R(6, 18, 12, 2.5, 1))], { noAccent: true }),
  ],
};
