import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('barometer-pricing', 'Barometer Pricing', ['pricing', 'cost', 'money', 'barometer', 'barometer'], [body(C(9.5, 10.5, 6.5)), line('M9.5 10.5l3-3'), line('M5.5 11.5h1M12.5 11.5h1M9.5 6v1'), body(C(9.5, 10.5, 1)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('fog-pricing', 'Fog Pricing', ['pricing', 'cost', 'money', 'fog', 'fog'], [line('M3 7h13M5 10.5h11M3 14h9M7 17.5h9'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('earthquake-pricing', 'Earthquake Pricing', ['pricing', 'cost', 'money', 'earthquake', 'earthquake'], [line('M2.5 10.5h3l1.5-4 2 8 2-10 2 9 1.5-3h2.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('thunderstorm-pricing', 'Thunderstorm Pricing', ['pricing', 'cost', 'money', 'thunderstorm', 'thunderstorm'], [body('M5 12.5a3 3 0 0 1 .3-6 4 4 0 0 1 7.7-.5 3 3 0 0 1 .5 6.5Z'), line('M9 13.5l-1.5 2.5h2.5L8.5 18.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
  ],
};
