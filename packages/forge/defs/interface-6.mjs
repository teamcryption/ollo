import { C, L } from '../src/geo.mjs';
import { icon, line, accent } from '../src/dsl.mjs';

export default {
  category: 'interface',
  icons: [
    icon('skeleton', 'Skeleton Loader', ['placeholder', 'loading state', 'shimmer', 'ghost content', 'lazy load'], [line(C(7.5, 8, 2.5)), line(L(12.5, 6.8, 19.5, 6.8)), line(L(12.5, 9.8, 16.5, 9.8)), line(L(4.5, 14.5, 19.5, 14.5)), accent(L(4.5, 18.5, 13.5, 18.5))], { anim: 'pulse' }),
  ],
};
