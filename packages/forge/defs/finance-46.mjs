import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('bank-trash', 'Delete Bank', ['delete', 'remove', 'trash', 'bank', 'bank'], [body(poly([[9.5, 3.5], [16, 7], [3, 7]], 0.8, true)), line('M5.5 9.5v5M9.5 9.5v5M13.5 9.5v5M3 17.5h12'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('invoice-trash', 'Delete Invoice', ['delete', 'remove', 'trash', 'invoice', 'invoice'], [body(R(4, 3.5, 11.5, 15.5, 2)), line('M7 7.5h5.5M7 10.5h5.5M7 13.5h3'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('card-trash', 'Delete Card', ['delete', 'remove', 'trash', 'card', 'card'], [body(R(3, 5, 13, 9.5, 1.5)), line('M3.2 8.5h12.6'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('piggy-trash', 'Delete Piggy Bank', ['delete', 'remove', 'trash', 'piggy bank', 'piggy'], [body('M4 10.5c0-2.5 2.5-4.5 6-4.5 1.5 0 2.8.3 3.8 1l1.7-1v2.3c.6.6 1 1.4 1 2.2H15c0 1.2-.6 2.3-1.5 3V16h-2v-1.2h-3V16h-2v-2c-1.5-.8-2.5-2-2.5-3.5Z'), line('M8.5 5.5h3'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('umbrella-trash', 'Delete Umbrella', ['delete', 'remove', 'trash', 'umbrella', 'umbrella'], [line('M3 10a6.5 6.5 0 0 1 13 0ZM9.5 10v5.5a1.5 1.5 0 0 0 3 0'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('atm-trash', 'Delete ATM', ['delete', 'remove', 'trash', 'atm', 'atm'], [body(R(3.5, 4, 12, 13, 1.5)), line(R(6, 6.5, 7, 4, 0.6)), line('M7 14h5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('calculator-trash', 'Delete Calculator', ['delete', 'remove', 'trash', 'calculator', 'calculator'], [body(R(4, 3.5, 11, 15, 2)), line('M6.5 6.5h6'), line(D(7, 10) + D(9.5, 10) + D(12, 10) + D(7, 13) + D(9.5, 13) + D(7, 15.5)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('safe-trash', 'Delete Safe', ['delete', 'remove', 'trash', 'safe', 'safe'], [body(R(3.5, 3.5, 12, 13, 2)), line(C(9.5, 10, 2.5)), line('M5.5 16.7v1.5M13.5 16.7v1.5'), line('M9.5 7.5v1'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('banknote-trash', 'Delete Banknote', ['delete', 'remove', 'trash', 'banknote', 'banknote'], [body(R(3, 6, 13, 8.5, 1.5)), line(C(9.5, 10.25, 2)), line(D(5.5, 8.3) + D(13.5, 12.2)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('wallet-trash', 'Delete Wallet', ['delete', 'remove', 'trash', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('dollar-coin-trash', 'Delete Coin', ['delete', 'remove', 'trash', 'coin', 'dollar-coin'], [body(C(9.5, 10.5, 6.5)), line('M9.5 6.5v8M11.3 8.3c-.5-.6-1.1-.8-1.8-.8-1 0-1.8.6-1.8 1.4 0 1.9 3.6 1 3.6 3 0 .8-.8 1.4-1.8 1.4-.8 0-1.4-.3-1.9-.9'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('trend-trash', 'Delete Growth', ['delete', 'remove', 'trash', 'growth', 'trend'], [line('M3.5 15l4-4 3 3 5.5-6'), line('M12.5 8H16v3.5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('candlestick-trash', 'Delete Stock Chart', ['delete', 'remove', 'trash', 'stock chart', 'candlestick'], [line('M6 4v13M13 4v13'), body(R(4.5, 7, 3, 6, 0.6)), body(R(11.5, 8.5, 3, 4.5, 0.6)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
  ],
};
