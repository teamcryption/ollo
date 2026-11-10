import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('dumbbell-clock', 'Workout Timer', ['exercise time', 'training session', 'gym', 'fitness', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('dumbbell-star', 'Personal Best', ['pb', 'record', 'achievement', 'fitness', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('dumbbell-pin', 'Gym Nearby', ['fitness centre location', 'gym map', 'training', 'fitness', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
