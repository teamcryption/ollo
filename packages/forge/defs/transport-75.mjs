import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('taxi-pricing', 'Taxi Pricing', ['pricing', 'cost', 'money', 'taxi', 'taxi'], [line('M7.5 8V6h4v2'), body(R(3.5, 8, 12, 6.5, 1.5)), line(D(6, 11.2) + D(13, 11.2)), line('M5 14.5V16M14 14.5V16'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('car-pricing', 'Car Pricing', ['pricing', 'cost', 'money', 'car', 'car'], [body('M3.5 12.5l1.6-4.3A1.5 1.5 0 0 1 6.5 7.2h6a1.5 1.5 0 0 1 1.4 1l1.6 4.3V16h-12Z'), line('M3.7 12.5h11.6'), line('M5 16v1.5M14 16v1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('bus-notice', 'Bus Notice', ['notice', 'important', 'attention', 'bus', 'bus'], [body(R(4, 3.5, 11, 12, 2)), line('M4.2 9h10.6'), line(D(6.5, 12.5) + D(12.5, 12.5)), line('M6 15.5v1.5M13 15.5v1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('fuel-notice', 'Fuel Station Notice', ['notice', 'important', 'attention', 'fuel station', 'fuel'], [body(R(4, 4, 8, 13, 1.5)), line(R(5.5, 6, 5, 3.5, 0.6)), line('M12 8h1.5l1.5 2v4.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('parking-notice', 'Parking Notice', ['notice', 'important', 'attention', 'parking', 'parking'], [body(R(3.5, 4, 12, 13, 2.5)), line('M7.5 14.5V7.5h2.5a2.2 2.2 0 0 1 0 4.4H7.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
