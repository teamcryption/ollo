import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'finance',
  icons: [
    icon('mortgage', 'Mortgage', ['home loan', 'property', 'interest rate', 'real estate'], [body('M4 11 12 4l8 7v9.5H4Z'), line(L(15, 11.5, 9, 18)), line(D(9.5, 12.2)), accent(D(14.5, 17.3))]),
    icon('won-circle', 'Won', ['krw', 'korea', 'currency', 'money'], [body(C(12, 12, 8.5)), accent('M7.5 8l2 8 2.5-6 2.5 6 2-8M7 11.5h10')], { anim: 'spin' }),
    icon('tip-jar', 'Tip Jar', ['tips', 'donation', 'gratuity', 'support'], [accent(C(12, 4.3, 1.3)), body('M7 7.5h10v2a2 2 0 0 1-1 1.7v7.3a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-7.3a2 2 0 0 1-1-1.7Z'), line(L(9.5, 14, 14.5, 14))], { anim: { preset: 'bounce', dist: 1 } }),
  ],
};
