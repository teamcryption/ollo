import { icon, body, line, accent } from '../src/dsl.mjs';
import { C, star } from '../src/geo.mjs';

const PIN = [body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];
const SH = [body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })];
const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));
// Top-down plane, upper left.
const PLANE = [body('M9.5 3.5c.8 0 1.2.8 1.2 1.8V9l5 3v1.8l-5-1.5v3.5l1.8 1.4V19l-3-.9-3 .9v-1.8l1.8-1.4v-3.5l-5 1.5V12l5-3V5.3c0-1 .4-1.8 1.2-1.8Z')];

export default {
  category: 'travel',
  icons: [
    icon('airplane-pin', 'Flight Tracker', ['track flight', 'plane location', 'live flight', 'aviation', 'map'], [...PLANE, ...PIN], { noAccent: true }),
    icon('airplane-clock', 'Flight Time', ['departure time', 'flight delay', 'flight duration', 'schedule', 'airport'], [...PLANE, ...CLOCK], { noAccent: true }),
    icon('airplane-shield', 'Travel Insurance', ['trip cover', 'flight protection', 'holiday insurance', 'safe travel', 'insurance'], [...PLANE, ...SH], { noAccent: true }),
    icon('airplane-search', 'Flight Search', ['find flights', 'compare fares', 'book flight', 'airfare', 'travel'], [...PLANE, ...LENS], { noAccent: true }),
    icon('ai-airplane', 'AI Trip Planner', ['travel ai', 'itinerary', 'smart booking', 'holiday planner', 'ai'], [...PLANE, spark(19, 5, 2.2)], { anim: 'pulse' }),
  ],
};
