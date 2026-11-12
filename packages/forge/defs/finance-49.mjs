import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('bank-upload', 'Upload Bank', ['upload', 'send', 'export', 'bank', 'bank'], [body(poly([[9.5, 3.5], [16, 7], [3, 7]], 0.8, true)), line('M5.5 9.5v5M9.5 9.5v5M13.5 9.5v5M3 17.5h12'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('piggy-upload', 'Upload Piggy Bank', ['upload', 'send', 'export', 'piggy bank', 'piggy'], [body('M4 10.5c0-2.5 2.5-4.5 6-4.5 1.5 0 2.8.3 3.8 1l1.7-1v2.3c.6.6 1 1.4 1 2.2H15c0 1.2-.6 2.3-1.5 3V16h-2v-1.2h-3V16h-2v-2c-1.5-.8-2.5-2-2.5-3.5Z'), line('M8.5 5.5h3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('calculator-upload', 'Upload Calculator', ['upload', 'send', 'export', 'calculator', 'calculator'], [body(R(4, 3.5, 11, 15, 2)), line('M6.5 6.5h6'), line(D(7, 10) + D(9.5, 10) + D(12, 10) + D(7, 13) + D(9.5, 13) + D(7, 15.5)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('cheque-upload', 'Upload Cheque', ['upload', 'send', 'export', 'cheque', 'cheque'], [body(R(3, 5.5, 13, 9, 1.5)), line('M5.5 9h5M5.5 11.5h3M10.5 12c1-1.5 2-1.5 2.5-.5s1.2 1 2-.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('gold-bar-upload', 'Upload Gold Bar', ['upload', 'send', 'export', 'gold bar', 'gold-bar'], [body(poly([[5, 10], [14, 10], [16, 16], [3, 16]], 0.6, true)), body(poly([[7, 4.5], [12, 4.5], [13.3, 9], [5.7, 9]], 0.6, true)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('vault-door-upload', 'Upload Vault', ['upload', 'send', 'export', 'vault', 'vault-door'], [body(R(3, 3.5, 13, 13, 2)), line(C(9.5, 10, 3.5)), line('M9.5 6.5v7M6 10h7'), line('M5 16.7v1.5M14 16.7v1.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('money-bag-upload', 'Upload Money Bag', ['upload', 'send', 'export', 'money bag', 'money-bag'], [line('M7.5 6.5 6 3.5h7l-1.5 3'), body('M7.5 6.8h4c2.5 2 4.5 4.5 4.5 7.2 0 2.5-2 4-6.5 4S3 16.5 3 14c0-2.7 2-5.2 4.5-7.2Z'), line('M9.5 10v5.5M11 11c-.3-.6-.8-.8-1.5-.8-1 0-1.5.5-1.5 1.2 0 1.6 3 1 3 2.6 0 .7-.6 1.2-1.5 1.2-.7 0-1.2-.3-1.5-.8'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ledger-upload', 'Upload Ledger', ['upload', 'send', 'export', 'ledger', 'ledger'], [body(R(4, 3, 11, 15, 1.5)), line('M4.2 7h10.6M4.2 10.5h10.6M4.2 14h10.6M8.5 3.2v14.6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
