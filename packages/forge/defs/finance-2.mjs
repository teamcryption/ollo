import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const COIN = C(12, 12, 8.5);

export default {
  category: 'finance',
  icons: [
    icon('cheque', 'Cheque', ['check', 'bank cheque', 'payment', 'signature', 'pay'], [body(R(2.5, 6, 19, 12, 2)), line(L(5.5, 10, 11, 10)), line(L(5.5, 14, 9, 14)), accent('M12.5 14.5c1-1.6 1.8-1.6 2.2 0s1.2 1.6 2.2 0 1.5-1.2 2.4 0')]),
    icon('money-bag', 'Money Bag', ['savings', 'funds', 'wealth', 'loot', 'capital'], [line('M9.5 7.8 8 4h8l-1.5 3.8'), body('M9.5 8h5c3 2.2 5 5 5 8a4.5 4.5 0 0 1-4.5 4.5h-6A4.5 4.5 0 0 1 4.5 16c0-3 2-5.8 5-8Z'), accent(L(12, 12.5, 12, 16.5))], { anim: 'wiggle' }),
    icon('atm', 'ATM', ['cash machine', 'withdraw', 'cash', 'bank'], [body(R(3, 4, 18, 7, 2)), body(R(7, 7.5, 10, 13, 1.5), { cover: true }), accent(C(12, 14.5, 2))], { anim: { preset: 'bounce', dist: 1.5 } }),
    icon('yen-circle', 'Yen', ['jpy', 'yuan', 'cny', 'currency', 'money'], [body(COIN), accent('M8.8 7.5 12 12l3.2-4.5M12 12v5M9.5 12.5h5M9.5 15h5')], { anim: 'spin' }),
    icon('rupee-circle', 'Rupee', ['inr', 'india', 'currency', 'money', 'taka'], [body(COIN), accent('M8.5 7.5h7M8.5 10.5h7M10 7.5h1a3 3 0 0 1 0 6H9l5 4.5')], { anim: 'spin' }),
    icon('percent-circle', 'Interest', ['percent', 'rate', 'interest', 'discount', 'apr'], [body(COIN), line(L(15.5, 8.5, 8.5, 15.5)), line(C(9, 9, 1.3)), accent(C(15, 15, 1.3))]),
    icon('send-money', 'Send Money', ['transfer', 'pay', 'remit', 'payment', 'wire'], [body(R(3, 3.5, 15, 9, 2)), line(C(10.5, 8, 2)), accent('M14 18h7M18.5 15.5 21 18l-2.5 2.5')], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
  ],
};
