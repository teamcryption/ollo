import { R, C, L, A, poly, D, E, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const pent = Array.from({ length: 5 }, (_, i) => {
  const a = ((-90 + i * 72) * Math.PI) / 180;
  return [12 + 3.3 * Math.cos(a), 12 + 3.3 * Math.sin(a)];
});
const ballSeams = pent.map(([x, y]) => line(L(x, y, 12 + (x - 12) * 2.5, 12 + (y - 12) * 2.5)));

export default {
  category: 'sports',
  icons: [
    icon('soccer-ball', 'Football', ['soccer', 'ball', 'football', 'match', 'goal'], [body(C(12, 12, 8.5)), line(poly(pent, 0.4, true)), ...ballSeams], { noAccent: true, anim: 'spin' }),
    icon('tennis-ball', 'Tennis Ball', ['tennis', 'ball', 'court', 'padel'], [body(C(12, 12, 8.5)), line('M5.6 6.4C10 7.5 12 9.5 12 12s2 4.5 6.4 5.6')], { noAccent: true, anim: { preset: 'bounce', dist: -2 } }),
    icon('volleyball', 'Volleyball', ['volleyball', 'beach', 'ball', 'net'], [body(C(12, 12, 8.5)), line('M12 12V3.5'), line('M12 12c-3 1.5-6.5 1.5-8.3.3'), line('M12 12c.5 3 2.3 5.5 4.8 7'), line('M8 4.5c-.5 4 1.2 7.5 4 7.5'), line('M20 15c-3-2-6.5-3-8-3')], { noAccent: true, anim: 'spin' }),
    icon('table-tennis', 'Table Tennis', ['ping pong', 'paddle', 'bat', 'racket'], [body(rotateD(R(4.5, 14.75, 6, 3, 1.5), -45, 7.5, 16.25)), body(C(13.5, 9.5, 6.5), { cover: true }), accent(C(4.5, 5, 1.4))]),
    icon('bowling', 'Bowling', ['pins', 'strike', 'alley', 'ball'], [line('M7 3.5c1.2 0 2 1 1.8 2.5L8.3 8c1.4 1.6 2 4 1.3 7L9 20.5H5L4.4 15c-.7-3 0-5.4 1.3-7L5.2 6C5 4.5 5.8 3.5 7 3.5Z'), body(C(15, 15, 5.5), { cover: true }), line(D(14, 12.5)), accent(D(16.8, 13))]),
    icon('skateboard', 'Skateboard', ['skate', 'board', 'street', 'ride'], [body(R(3, 9, 18, 4, 2)), line(C(7, 16.5, 1.6)), accent(C(17, 16.5, 1.6))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('shuttlecock', 'Badminton', ['shuttlecock', 'birdie', 'badminton', 'racket sport'], [body(poly([[9.8, 16], [6, 4], [18, 4], [14.2, 16]], 0.8, true)), line(L(10.5, 4.2, 11.2, 15.8)), line(L(13.5, 4.2, 12.8, 15.8)), body(C(12, 18.3, 2.3), { cover: true })], { noAccent: true }),
    icon('rugby-ball', 'Rugby Ball', ['american football', 'rugby', 'nfl', 'ball'], [body(rotateD(E(12, 12, 9, 5.5), -45)), line(rotateD(L(9, 12, 15, 12), -45)), line(rotateD(L(10.5, 10.8, 10.5, 13.2), -45)), line(rotateD(L(13.5, 10.8, 13.5, 13.2), -45))], { noAccent: true }),
    icon('jump-rope', 'Jump Rope', ['skipping rope', 'cardio', 'fitness', 'workout'], [body(R(4, 3.5, 3, 7, 1.5)), body(R(17, 3.5, 3, 7, 1.5)), line('M5.5 10.5c0 6 2.5 10 6.5 10s6.5-4 6.5-10')], { noAccent: true }),
    icon('surfboard', 'Surfboard', ['surf', 'beach', 'waves', 'board'], [body(rotateD(E(12, 12, 3.8, 9.3), 35)), line(rotateD(L(12, 4, 12, 20), 35)), line(rotateD(L(12, 16.5, 9.8, 16.5), 35))], { noAccent: true }),
  ],
};
