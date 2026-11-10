import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('water-clock', 'Hydration Reminder', ['drink water', 'water tracker', 'health', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('glasses-search', 'Eye Test', ['vision check', 'optician exam', 'eyes', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('glasses-pin', 'Optician Nearby', ['eye care location', 'glasses shop', 'map', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('glasses-clock', 'Eye Appointment', ['optician booking', 'eye exam time', 'vision', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
  ],
};
