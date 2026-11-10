import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('wallet-clock', 'Pending Payment', ['payment history', 'scheduled payment', 'wallet', 'transactions', 'wallet'], [body(R(3, 5, 14, 11, 2.5)), line('M16.8 8.5h-3.3a1.75 1.75 0 0 0 0 3.5h3.3'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('wallet-heart', 'Donations Wallet', ['charity', 'giving', 'saved money', 'wallet', 'wallet'], [body(R(3, 5, 14, 11, 2.5)), line('M16.8 8.5h-3.3a1.75 1.75 0 0 0 0 3.5h3.3'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('wallet-star', 'Rewards Wallet', ['cashback', 'points', 'loyalty', 'wallet', 'wallet'], [body(R(3, 5, 14, 11, 2.5)), line('M16.8 8.5h-3.3a1.75 1.75 0 0 0 0 3.5h3.3'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('wallet-bolt', 'Instant Pay', ['quick payment', 'tap to pay', 'fast transfer', 'wallet', 'wallet'], [body(R(3, 5, 14, 11, 2.5)), line('M16.8 8.5h-3.3a1.75 1.75 0 0 0 0 3.5h3.3'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('invoice-search', 'Find Invoice', ['invoice lookup', 'billing search', 'accounts', 'receipts', 'invoice'], [body(R(4, 3.5, 11.5, 15.5, 2)), line('M7 7.5h5.5M7 10.5h5.5M7 13.5h3'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('invoice-bolt', 'Instant Invoice', ['quick billing', 'auto invoice', 'fast', 'accounts', 'invoice'], [body(R(4, 3.5, 11.5, 15.5, 2)), line('M7 7.5h5.5M7 10.5h5.5M7 13.5h3'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('invoice-gear', 'Billing Settings', ['invoice settings', 'billing preferences', 'accounts', 'configure', 'invoice'], [body(R(4, 3.5, 11.5, 15.5, 2)), line('M7 7.5h5.5M7 10.5h5.5M7 13.5h3'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
  ],
};
