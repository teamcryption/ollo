import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'navigation',
  icons: [
    icon('compass', 'Compass', ['explore', 'direction', 'discover', 'navigate'], [body(C(12, 12, 8.5)), accent(poly([[15, 9], [13.3, 13.3], [9, 15], [10.7, 10.7]], 0.6, true))], { anim: 'spin' }),
    icon('map', 'Map', ['location', 'travel', 'route', 'atlas', 'guide'], [body(poly([[3.5, 6], [9, 4], [15, 6], [20.5, 4], [20.5, 18], [15, 20], [9, 18], [3.5, 20]], 1, true)), line(L(9, 4.4, 9, 17.6)), line(L(15, 6.4, 15, 19.6))], { noAccent: true, badges: ['add', 'check'] }),
    icon('globe', 'Globe', ['world', 'internet', 'language', 'web', 'international'], [body(C(12, 12, 8.5)), line(E2()), line(L(3.7, 12, 20.3, 12))], { noAccent: true, anim: 'spin' }),
    icon('navigation', 'Navigation Arrow', ['gps', 'direction', 'location', 'heading'], [body(poly([[12, 3.5], [19, 20], [12, 16.5], [5, 20]], 1.2, true))], { noAccent: true, anim: { preset: 'nudge', dir: [0, -1], dist: 2 } }),
    icon('route', 'Route', ['path', 'directions', 'journey', 'way'], [body(C(6, 6, 2.2)), line('M8.2 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.6'), body(C(18, 18, 2.2))], { noAccent: true }),
    icon('signpost', 'Signpost', ['direction', 'guide', 'sign', 'crossroads'], [line(L(12, 3, 12, 21)), body(poly([[13.5, 5], [18.5, 5], [20.5, 7], [18.5, 9], [13.5, 9]], 0.8, true)), body(poly([[10.5, 11], [5.5, 11], [3.5, 13], [5.5, 15], [10.5, 15]], 0.8, true))], { noAccent: true }),
    icon('layers', 'Layers', ['stack', 'levels', 'overlay', 'arrange'], [body(poly([[12, 4], [20, 8.5], [12, 13], [4, 8.5]], 1, true)), line('M4.5 12.5 12 17l7.5-4.5'), line('M6.5 15.8 12 19.2l5.5-3.4')], { noAccent: true }),
    icon('crosshair', 'Crosshair', ['gps', 'target', 'locate', 'center', 'aim'], [line(C(12, 12, 6.5)), line(L(12, 2.5, 12, 5)), line(L(12, 19, 12, 21.5)), line(L(2.5, 12, 5, 12)), line(L(19, 12, 21.5, 12)), accent(C(12, 12, 2))], { anim: 'pulse' }),
    icon('location-radius', 'Nearby', ['radius', 'around me', 'location', 'area'], [body('M12 15s-4.5-3.8-4.5-7.5a4.5 4.5 0 0 1 9 0C16.5 11.2 12 15 12 15Z'), accent(D(12, 7.5)), line('M7 14.2c-2.1.6-3.5 1.5-3.5 2.6 0 1.9 3.8 3.4 8.5 3.4s8.5-1.5 8.5-3.4c0-1.1-1.4-2-3.5-2.6')], { anim: { preset: 'bounce', dist: -2 } }),
  ],
};

function E2() {
  // meridian ellipse
  return 'M12 3.5c-2.2 2.3-3.4 5.2-3.4 8.5s1.2 6.2 3.4 8.5c2.2-2.3 3.4-5.2 3.4-8.5S14.2 5.8 12 3.5Z';
}
