import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('gift-upload', 'Upload Gift', ['upload', 'send', 'export', 'gift', 'gift'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('cash-register-upload', 'Upload Cash Register', ['upload', 'send', 'export', 'cash register', 'cash-register'], [body(R(5, 3.5, 6, 4, 1)), line('M8 7.7V11'), body('M3.5 11h12v6a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1Z'), line(D(6, 13.3) + D(8.5, 13.3) + D(11, 13.3)), line('M3.7 15.5h11.6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('barcode-scanner-upload', 'Upload Barcode Scanner', ['upload', 'send', 'export', 'barcode scanner', 'barcode-scanner'], [body('M3 6.5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 2 2V9a2 2 0 0 1-2 2H9.5l-1 7h-3l1-7H5a2 2 0 0 1-2-2Z'), line('M14.7 6.3 17 5M14.7 9.2 17 10.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pos-terminal-upload', 'Upload Card Terminal', ['upload', 'send', 'export', 'card terminal', 'pos-terminal'], [body(R(5, 3, 9, 15.5, 1.8)), line(R(6.8, 5, 5.4, 3.5, 0.6)), line(D(7.5, 11.5) + D(9.5, 11.5) + D(11.5, 11.5) + D(7.5, 14) + D(9.5, 14) + D(11.5, 14)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('hanging-sign-upload', 'Upload Hanging Sign', ['upload', 'send', 'export', 'hanging sign', 'hanging-sign'], [line('M4 3.5h11M6.5 3.7 5.5 7.5M12.5 3.7l1 3.8'), body(R(3.5, 7.5, 12, 7, 1.5)), line('M6.5 11h6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('gift-card-upload', 'Upload Gift Card', ['upload', 'send', 'export', 'gift card', 'gift-card'], [body(R(3, 5.5, 13, 9.5, 1.5)), line('M7 5.7v9.1M3.2 9.5h12.6'), line('M7 9.5c-1-2-2.5-2.3-3-1.3M7 9.5c1-2 2.5-2.3 3-1.3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
