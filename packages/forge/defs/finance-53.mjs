import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('card-pause', 'Pause Card', ['pause', 'hold', 'stop', 'card', 'card'], [body(R(3, 5, 13, 9.5, 1.5)), line('M3.2 8.5h12.6'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('wallet-pause', 'Pause Wallet', ['pause', 'hold', 'stop', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('blockchain-pause', 'Pause Blockchain', ['pause', 'hold', 'stop', 'blockchain', 'blockchain'], [body(R(3, 3, 5, 5, 1)), body(R(11, 3, 5, 5, 1)), body(R(3, 12.5, 5, 5, 1)), body(R(11, 12.5, 5, 5, 1)), line('M8.2 5.5h2.6M5.5 8.2v4.1M13.5 8.2v4.1M8.2 15h2.6'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('bank-leaf', 'Eco Bank', ['eco', 'green', 'sustainable', 'bank', 'bank'], [body(poly([[9.5, 3.5], [16, 7], [3, 7]], 0.8, true)), line('M5.5 9.5v5M9.5 9.5v5M13.5 9.5v5M3 17.5h12'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('piggy-leaf', 'Eco Piggy Bank', ['eco', 'green', 'sustainable', 'piggy bank', 'piggy'], [body('M4 10.5c0-2.5 2.5-4.5 6-4.5 1.5 0 2.8.3 3.8 1l1.7-1v2.3c.6.6 1 1.4 1 2.2H15c0 1.2-.6 2.3-1.5 3V16h-2v-1.2h-3V16h-2v-2c-1.5-.8-2.5-2-2.5-3.5Z'), line('M8.5 5.5h3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('wallet-leaf', 'Eco Wallet', ['eco', 'green', 'sustainable', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('trend-leaf', 'Eco Growth', ['eco', 'green', 'sustainable', 'growth', 'trend'], [line('M3.5 15l4-4 3 3 5.5-6'), line('M12.5 8H16v3.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('candlestick-leaf', 'Eco Stock Chart', ['eco', 'green', 'sustainable', 'stock chart', 'candlestick'], [line('M6 4v13M13 4v13'), body(R(4.5, 7, 3, 6, 0.6)), body(R(11.5, 8.5, 3, 4.5, 0.6)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
