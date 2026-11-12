import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('basket-pricing', 'Basket Pricing', ['pricing', 'cost', 'money', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('cash-register-pricing', 'Cash Register Pricing', ['pricing', 'cost', 'money', 'cash register', 'cash-register'], [body(R(5, 3.5, 6, 4, 1)), line('M8 7.7V11'), body('M3.5 11h12v6a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1Z'), line(D(6, 13.3) + D(8.5, 13.3) + D(11, 13.3)), line('M3.7 15.5h11.6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('discount-pricing', 'Discount Pricing', ['pricing', 'cost', 'money', 'discount', 'discount'], [body(star(9.5, 10.5, 7, 5.8, 10, 0.6)), line('M7.3 13l4.4-5'), line(D(7.2, 8.3) + D(11.8, 12.7)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('pos-terminal-pricing', 'Card Terminal Pricing', ['pricing', 'cost', 'money', 'card terminal', 'pos-terminal'], [body(R(5, 3, 9, 15.5, 1.8)), line(R(6.8, 5, 5.4, 3.5, 0.6)), line(D(7.5, 11.5) + D(9.5, 11.5) + D(11.5, 11.5) + D(7.5, 14) + D(9.5, 14) + D(11.5, 14)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('basket-full-pricing', 'Basket Full Pricing', ['pricing', 'cost', 'money', 'basket full', 'basket-full'], [line('M3 8.5h13M6 8.5 8.5 3.5M13 8.5 10.5 3.5'), body('M3.5 9h12l-1.3 7.7a1.5 1.5 0 0 1-1.5 1.3H6.3a1.5 1.5 0 0 1-1.5-1.3Z'), line('M7 11.5v3.5M9.5 11.5v3.5M12 11.5v3.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('basket-notice', 'Basket Notice', ['notice', 'important', 'attention', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('crown-notice', 'Crown Notice', ['notice', 'important', 'attention', 'crown', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
