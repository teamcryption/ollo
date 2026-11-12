import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('bike-pricing', 'Bike Pricing', ['pricing', 'cost', 'money', 'bike', 'bike'], [line(C(5.5, 13, 2.5) + C(13.5, 13, 2.5)), line('M5.5 13 8 8h4.5l1 5M8 8 9.5 13h4M7.5 6h2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('whistle-pricing', 'Whistle Pricing', ['pricing', 'cost', 'money', 'whistle', 'whistle'], [line('M5.6 9.4 4 6'), body('M8.5 8.5h7V12h-3.4A3.8 3.8 0 1 1 8.5 8.5Z'), line(D(8.3, 12.3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('basketball-hoop-pricing', 'Basketball Hoop Pricing', ['pricing', 'cost', 'money', 'basketball hoop', 'basketball-hoop'], [body(R(4, 3, 11, 7, 1)), line(R(7.5, 5.3, 4, 2.6, 0.5)), line('M6.3 11.3h6.4'), line('M7 11.5l1 5h3l1-5M9.5 11.5v5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('bike-notice', 'Bike Notice', ['notice', 'important', 'attention', 'bike', 'bike'], [line(C(5.5, 13, 2.5) + C(13.5, 13, 2.5)), line('M5.5 13 8 8h4.5l1 5M8 8 9.5 13h4M7.5 6h2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('dumbbell-notice', 'Dumbbell Notice', ['notice', 'important', 'attention', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('soccer-notice', 'Soccer Notice', ['notice', 'important', 'attention', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
