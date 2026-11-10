import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'transport',
  icons: [
    icon('lifeboat', 'Lifeboat', ['rescue boat', 'emergency', 'evacuation', 'sea', 'survival'], [body('M6 13V10a2.5 2.5 0 0 1 2.5-2.5h7A2.5 2.5 0 0 1 18 10v3Z'), line(D(9.5, 10.5) + D(12, 10.5) + D(14.5, 10.5)), body('M3 13h18l-2.5 5.5h-13Z', { cover: true })], { noAccent: true }),
    icon('fishing-boat', 'Fishing Boat', ['trawler', 'fishing', 'harbor', 'sea', 'catch'], [body(R(5, 8.5, 6, 5.5, 1)), line('M13 14 19.5 4.5M19.5 4.5v6'), body('M3 14h18l-2.5 5h-13Z', { cover: true })], { noAccent: true }),
    icon('paraglider', 'Paraglider', ['paragliding', 'parachute', 'glide', 'adventure', 'flying'], [body('M3.5 8a8.5 4.5 0 0 1 17 0 8.5 3 0 0 0-17 0Z'), line('M4.5 8.5 11 17.5M19.5 8.5 13 17.5M9.5 6.5l2 11M14.5 6.5l-2 11'), body(C(12, 19, 1.5))], { noAccent: true }),
    icon('hang-glider', 'Hang Glider', ['gliding', 'flying', 'wing', 'adventure', 'sky'], [body(poly([[12, 5], [20.5, 12.5], [12, 10.5], [3.5, 12.5]], 0.8, true)), line('M12 10.5v6.5M9.5 17h5'), body(C(12, 19.2, 1.3))], { noAccent: true }),
    icon('ferry', 'Ferry', ['passenger ship', 'boat', 'crossing', 'harbor', 'transport'], [body(R(8, 5.5, 7, 3.5, 0.8)), body(R(5.5, 9.5, 13, 4.5, 0.8)), line(D(8.5, 11.75) + D(11, 11.75) + D(13.5, 11.75) + D(16, 11.75)), body('M3 14h18l-2.5 5.5h-13Z', { cover: true })], { noAccent: true }),
  ],
};
