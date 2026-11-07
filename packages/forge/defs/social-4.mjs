import { R, star } from '../src/geo.mjs';
import { icon, body, accent } from '../src/dsl.mjs';

export default {
  category: 'social',
  icons: [
    icon('leaderboard', 'Leaderboard', ['ranking', 'top players', 'winners', 'standings', 'podium'], [body(R(3.5, 12.5, 5, 8, 1)), body(R(9.5, 9.5, 5, 11, 1)), body(R(15.5, 14.5, 5, 6, 1)), accent(star(12, 5.4, 2.2, 0.95, 5, 0.2))]),
  ],
};
