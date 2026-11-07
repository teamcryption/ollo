import { L, star } from '../src/geo.mjs';
import { icon, line, accent } from '../src/dsl.mjs';

export default {
  category: 'ai',
  icons: [
    icon('ai-summary', 'AI Summary', ['summarise', 'tl;dr', 'digest', 'key points', 'recap'], [line(L(4, 6, 15, 6)), line(L(4, 10, 15, 10)), line(L(4, 14, 10, 14)), line(L(4, 18, 9, 18)), accent(star(16.5, 16, 3.6, 1.1, 4, 0.3))], { anim: 'pulse' }),
  ],
};
