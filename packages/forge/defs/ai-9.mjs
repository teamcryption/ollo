import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, star } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-camera', 'AI Camera', ['smart camera', 'ai photo', 'scene detection', 'computational photography', 'lens'], [body('M3 10.5A2.5 2.5 0 0 1 5.5 8h1.8l1.2-2h4l1.2 2h.8A2.5 2.5 0 0 1 17 10.5v6a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5Z'), line(C(10, 13, 3)), spark(19, 5.5, 2.2)], { anim: 'pulse' }),
    icon('ai-presentation', 'AI Slides', ['generate slides', 'ai deck', 'presentation maker', 'pitch', 'slides'], [body(R(3, 5, 12.5, 9.5, 2)), line('M6 11.5l2.5-2.5 2 2 2.5-2.5'), line('M9.25 14.5v3M6.25 20.5l3-3 3 3'), spark(19.2, 4.6, 2)], { anim: 'pulse' }),
    icon('ai-phone', 'AI Phone', ['on device ai', 'smart phone ai', 'mobile assistant', 'phone ai', 'app'], [body(R(4, 3, 10.5, 18, 2.5)), line('M8 5.8h2.5'), spark(18.8, 8, 2.3)], { anim: 'pulse' }),
  ],
};
