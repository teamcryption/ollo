import { R, C, L, A, poly, D, head } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const NOTE = R(2.5, 6, 19, 12, 2.5);

export default {
  category: 'finance',
  icons: [
    icon('banknote', 'Banknote', ['cash', 'money', 'bill', 'payment', 'currency'], [body(NOTE), line(C(12, 12, 2.6)), accent(D(6, 9.5)), line(D(18, 14.5))], { badges: ['add', 'check', 'close'] }),
    icon('banknotes', 'Banknotes', ['cash', 'money stack', 'savings', 'payout'], [line('M5 4h13a3 3 0 0 1 3 3v8'), body(R(2.5, 7, 16, 11, 2.5), { cover: true }), line(C(10.5, 12.5, 2.3)), accent(D(5.5, 12.5))]),
    icon('bank', 'Bank', ['institution', 'building', 'finance', 'banking', 'treasury'], [body(poly([[12, 3.5], [20.5, 8], [3.5, 8]], 1, true)), line(L(6, 11, 6, 17)), line(L(10, 11, 10, 17)), line(L(14, 11, 14, 17)), accent(L(18, 11, 18, 17)), line(L(3.5, 20, 20.5, 20))]),
    icon('piggy-bank', 'Piggy Bank', ['savings', 'save money', 'deposit', 'budget'], [body('M5 11.5a6 5 0 0 1 6-4.5h3a6.5 5.5 0 0 1 5.5 3l1.5.3v3.6l-1.7.5a6 6 0 0 1-2.3 2.6V19h-2.5v-1.6h-3.5V19H8.5v-2.4A5.5 5.5 0 0 1 5 11.5Z'), accent(L(10, 4, 14, 4)), line(D(16.3, 10.6))], { anim: { preset: 'bounce', dist: -1.5 } }),
    icon('dollar-circle', 'Dollar', ['usd', 'money', 'currency', 'price', 'payment'], [body(C(12, 12, 8.5)), accent('M14.5 9.4a2.6 2.6 0 0 0-2.5-1.4c-1.5 0-2.6.8-2.6 2s1 1.7 2.6 2c1.6.3 2.6.9 2.6 2.1s-1.1 2-2.6 2a2.7 2.7 0 0 1-2.6-1.5M12 6.3v1.5M12 16.2v1.5')], { anim: 'spin' }),
    icon('euro-circle', 'Euro', ['eur', 'money', 'currency', 'price'], [body(C(12, 12, 8.5)), accent('M15.3 8.8a4 4 0 1 0 0 6.4M7.6 11h4.6M7.6 13.2h4.6')], { anim: 'spin' }),
    icon('pound-circle', 'Pound', ['gbp', 'sterling', 'money', 'currency'], [body(C(12, 12, 8.5)), accent('M14.8 9.5a2.5 2.5 0 0 0-4.8.9V16.5m-1.5 0h7M8.6 12.4h4.2')], { anim: 'spin' }),
    icon('chart-coin', 'Investment', ['invest', 'growth', 'returns', 'stocks', 'portfolio'], [body(C(8, 15.5, 4.5)), accent(L(8, 13.5, 8, 17.5)), line(poly([[12.8, 11], [15.5, 8.3], [17.3, 10], [20.5, 6.5]], 0.6)), line(poly([[17.7, 6.3], [20.7, 6.3], [20.7, 9.3]], 0.5))], { anim: { preset: 'bounce', dist: -1.5 } }),
    icon('invoice', 'Invoice', ['bill', 'statement', 'payment due', 'document'], [body(R(5, 3, 14, 18, 2.5)), line(L(8.5, 7.5, 13, 7.5)), line(L(8.5, 11, 15.5, 11)), line(L(8.5, 14.5, 15.5, 14.5)), accent(L(12.5, 17.5, 15.5, 17.5))], { badges: ['check', 'alert'] }),
    icon('calculator', 'Calculator', ['math', 'accounting', 'budget', 'compute'], [body(R(5, 3, 14, 18, 2.5)), line(R(8, 6, 8, 3.5, 1)), line(D(9, 13)), line(D(12, 13)), line(D(15, 13)), line(D(9, 16.5)), line(D(12, 16.5)), accent(D(15, 16.5))]),
    icon('receipt-tax', 'Tax', ['vat', 'percent', 'duty', 'receipt'], [body(poly([[6, 3.5], [18, 3.5], [18, 20.5], [16, 19], [14, 20.5], [12, 19], [10, 20.5], [8, 19], [6, 20.5]], 0.6, true)), line(L(9.5, 14, 14.5, 9)), accent(D(9.8, 9.3)), line(D(14.2, 13.7))]),
    icon('card-swipe', 'Card Payment', ['pos', 'terminal', 'contactless', 'pay'], [body(R(6, 3, 12, 18, 2.5)), line(L(6.2, 7.5, 17.8, 7.5)), accent(R(9, 11, 6, 4, 1)), line(L(10.5, 18, 13.5, 18))]),
    icon('exchange', 'Currency Exchange', ['convert', 'forex', 'swap', 'transfer'], [body(C(8, 8, 4.5)), body(C(16, 16, 4.5), { cover: true }), accent(L(16, 14, 16, 18)), line(poly([[16, 4.5], [19.5, 4.5], [19.5, 8]], 0.6)), line(poly([[8, 19.5], [4.5, 19.5], [4.5, 16]], 0.6))]),
  ],
};
