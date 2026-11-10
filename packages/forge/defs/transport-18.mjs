import { icon, body, line, accent } from '../src/dsl.mjs';
import { C, poly, gear, star } from '../src/geo.mjs';

// Side-on car, upper left; a small modifier sits in front, bottom right.
const CAR = [body(poly([[3, 14.5], [3, 11.2], [5.2, 6.5], [13.3, 6.5], [16, 11.2], [16, 14.5]], 1, true)), line('M3.2 11h12.6'), body(C(6.5, 15.5, 1.8), { cover: true })];
const PIN = [body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];
const SH = [body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })];
const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const GEAR = [body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))];
const BOLT = [body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })];
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('car-pin', 'Parked Car', ['find my car', 'parking spot', 'car location', 'where parked', 'vehicle'], [...CAR, ...PIN], { noAccent: true }),
    icon('car-clock', 'Parking Time', ['parking timer', 'car rental', 'meter time', 'hourly parking', 'vehicle'], [...CAR, ...CLOCK], { noAccent: true }),
    icon('car-shield', 'Car Insurance', ['vehicle cover', 'auto insurance', 'protection', 'motor policy', 'safe driving'], [...CAR, ...SH], { noAccent: true }),
    icon('car-bolt', 'Electric Car', ['ev', 'electric vehicle', 'charging car', 'battery car', 'green transport'], [...CAR, ...BOLT], { noAccent: true }),
    icon('ai-car', 'Self-driving Car', ['autonomous vehicle', 'robotaxi', 'autopilot', 'smart car', 'ai'], [...CAR, spark(19.5, 5, 2)], { anim: 'pulse' }),
  ],
};
