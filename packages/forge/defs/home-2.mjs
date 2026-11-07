import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('shower', 'Shower', ['bathroom', 'wash', 'bath', 'hygiene', 'water'], [line('M5 21V6.5a3 3 0 0 1 3-3h4.5a3 3 0 0 1 3 3V7'), body('M11.5 11a4 4 0 0 1 8 0Z'), line(D(12.5, 14.5)), line(D(15.5, 15)), line(D(18.5, 14.5)), line(D(13.8, 18.3)), accent(D(17.3, 18.6))], { anim: { preset: 'bounce', dist: 1 } }),
    icon('toilet', 'Toilet', ['restroom', 'wc', 'bathroom', 'lavatory'], [line(R(4.5, 3.5, 6.5, 6, 1.5)), body('M4.5 11h15a7 7 0 0 1-7 6.5h-1L12 20.5H7l.5-3.4A6.5 6.5 0 0 1 4.5 11Z'), accent(L(13.5, 5.5, 15.5, 5.5))]),
    icon('stove', 'Stove', ['oven', 'cooker', 'range', 'kitchen', 'bake'], [body(R(3.5, 6, 17, 14.5, 2)), line(L(3.7, 10, 20.3, 10)), line(D(7, 8)), line(D(10, 8)), line(L(9, 3.5, 9, 4)), line(L(15, 3.5, 15, 4)), accent(R(7, 13, 10, 4.5, 1))]),
    icon('microwave', 'Microwave', ['oven', 'kitchen', 'heat', 'appliance'], [body(R(3, 5, 18, 14, 2)), line(R(5.5, 7.5, 9.5, 9, 1)), line(D(17.5, 8.5)), accent(L(17.5, 12.5, 17.5, 16.5))]),
    icon('plant-pot', 'House Plant', ['plant', 'pot', 'garden', 'decor', 'grow'], [line(L(12, 13, 12, 8)), body('M12 10c-3.5 0-5.5-2-5.5-5.5 3.5 0 5.5 2 5.5 5.5Z'), body('M12 8c0-2.8 1.8-4.5 4.5-4.5 0 2.8-1.8 4.5-4.5 4.5Z'), body('M6.5 13h11l-1.5 7.5h-8Z'), accent(L(9.5, 16.5, 14.5, 16.5))]),
    icon('ceiling-fan', 'Ceiling Fan', ['fan', 'cooling', 'air', 'ventilation'], [line(L(12, 3, 12, 7)), body(C(12, 9, 2)), body(R(3.5, 8, 6.5, 2, 1)), body(R(14, 8, 6.5, 2, 1)), accent(A(12, 12, 7, 60, 120))], { anim: 'wiggle' }),
    icon('thermostat', 'Thermostat', ['heating', 'temperature', 'climate', 'smart home', 'hvac'], [body(C(12, 12, 8.5)), line(A(12, 12, 5.5, 135, 405)), accent(D(12, 12))]),
    icon('kettle', 'Kettle', ['tea', 'boil', 'kitchen', 'hot water'], [line('M9.5 9V7.5a2 2 0 0 1 4 0V9'), body('M5.5 20.5 7 9h9l1.5 11.5Z'), line('M16.5 10.5h1.5a2.5 2.5 0 0 1 2.5 2.5v2.5a2.5 2.5 0 0 1-2.5 2.5h-.5'), line(L(6.8, 11, 3.5, 8.5)), accent(L(9.5, 15, 13.5, 15))]),
    icon('light-switch', 'Light Switch', ['switch', 'toggle', 'lights', 'power', 'wall'], [body(R(5, 3, 14, 18, 3)), line(R(9, 6.5, 6, 11, 1.5)), accent(L(12, 9, 12, 11.5))]),
    icon('broom', 'Broom', ['sweep', 'clean', 'housework', 'tidy'], [line(L(19, 3.5, 12.5, 11.5)), body(poly([[10.5, 10], [15, 13.5], [12, 20.5], [4.5, 15.5]], 0.8, true)), line(L(7.5, 17.5, 10, 14.5)), line(L(10.5, 19, 12.5, 15.5))], { noAccent: true, anim: 'wiggle' }),
    icon('smoke-detector', 'Smoke Detector', ['smoke alarm', 'fire', 'safety', 'sensor'], [line(L(3, 4.5, 21, 4.5)), body('M5 6.5h14a7 7 0 0 1-14 0Z'), accent('M7.5 18c1-1 2-1 3 0s2 1 3 0 2-1 3 0')], { badges: ['alert'] }),
  ],
};
