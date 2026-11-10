import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'sports',
  icons: [
    icon('hockey-puck', 'Hockey Puck', ['ice hockey', 'puck', 'nhl', 'rink', 'sport'], [body('M4 9.5c0-2 3.6-3.5 8-3.5s8 1.5 8 3.5v4c0 2-3.6 3.5-8 3.5s-8-1.5-8-3.5Z'), line('M4.2 9.6c0 2 3.6 3.4 7.8 3.4s7.8-1.4 7.8-3.4'), accent('M5 20h4M11.5 20h3')]),
    icon('frisbee', 'Flying Disc', ['frisbee', 'ultimate', 'throw', 'beach', 'park'], [body(E(12, 14, 8.5, 3.5)), line('M7 13.2c1.4-.8 3.1-1.2 5-1.2'), accent('M6 7.5l1.5 1.5M11.5 5v2.5M17 6.5l-1 1.8')]),
    icon('hurdle', 'Hurdle', ['track and field', 'athletics', 'obstacle', 'jump', 'race'], [body(R(4, 6, 16, 4, 1)), line('M6 10v10.5M18 10v10.5M3.5 20.5h5M15.5 20.5h5'), line('M9.5 6.2v3.6M14.5 6.2v3.6')], { noAccent: true }),
    icon('football-helmet', 'Football Helmet', ['american football', 'gridiron', 'helmet', 'nfl', 'quarterback'], [body('M4.5 14A7.5 7.5 0 0 1 19 11.5L13.5 13v4.5H9A4.5 4.5 0 0 1 4.5 14Z'), line('M13.5 14.2h7M16.5 13.5v5.5M13.5 19h6'), line(C(9, 12.5, 1.3))], { noAccent: true }),
    icon('penalty-cards', 'Penalty Cards', ['referee', 'yellow card', 'red card', 'foul', 'soccer'], [...rot([body(R(5, 4, 9, 13, 1.5))], -12), ...rot([body(R(10, 7, 9, 13, 1.5), { cover: true })], 10)], { noAccent: true }),
    icon('sports-bottle', 'Sports Bottle', ['water bottle', 'gym', 'hydration', 'squeeze bottle', 'workout'], [line('M12 3.5v1.5'), body(R(9.5, 5, 5, 2.5, 1)), body('M7 7.5h10v11a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 18.5Z'), line('M7.2 12h9.6M7.2 15h9.6')], { noAccent: true }),
    icon('boxing-ring', 'Boxing Ring', ['ring', 'boxing', 'wrestling', 'fight', 'arena'], [body(R(3.5, 14.5, 17, 5, 1)), line('M5 5v9.5M19 5v9.5M5 7.5h14M5 11h14')], { noAccent: true }),
  ],
};
