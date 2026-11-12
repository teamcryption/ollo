import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('backpack-pricing', 'Backpack Pricing', ['pricing', 'cost', 'money', 'backpack', 'backpack'], [line('M7.5 5.5V5a2 2 0 0 1 4 0v.5'), body('M4.5 9a3.5 3.5 0 0 1 3.5-3.5h3A3.5 3.5 0 0 1 14.5 9v8a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 17Z'), line('M7.5 12h4v3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('ship-wheel-pricing', 'Ship Wheel Pricing', ['pricing', 'cost', 'money', 'ship wheel', 'ship-wheel'], [line(C(9.5, 10.5, 4.5)), line(C(9.5, 10.5, 1.3)), line('M9.5 3.5v5.7M9.5 11.8v5.7M2.5 10.5h5.7M10.8 10.5h5.7M4.5 5.5l4 4M14.5 5.5l-4 4M4.5 15.5l4-4'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('tent-notice', 'Tent Notice', ['notice', 'important', 'attention', 'tent', 'tent'], [body(poly([[9.5, 4], [16, 16.5], [3, 16.5]], 0.8, true)), line('M9.5 10.5v6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('ship-notice', 'Ship Notice', ['notice', 'important', 'attention', 'ship', 'ship'], [line('M9.5 12V4.5l4.5 5.5H9.5'), body('M3 12h13l-1.8 4.2H4.8Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('passport-notice', 'Passport Notice', ['notice', 'important', 'attention', 'passport', 'passport'], [body(R(4, 3.5, 11, 14, 1.5)), line(C(9.5, 9, 2.5)), line('M7 14h5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('suitcase-notice', 'Suitcase Notice', ['notice', 'important', 'attention', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('umbrella-notice', 'Umbrella Notice', ['notice', 'important', 'attention', 'umbrella', 'umbrella'], [line('M3 10a6.5 6.5 0 0 1 13 0ZM9.5 10v5.5a1.5 1.5 0 0 0 3 0'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
