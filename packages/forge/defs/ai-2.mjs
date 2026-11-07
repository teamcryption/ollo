import { R, C, L, A, poly, D, star } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-write', 'AI Writing', ['generate text', 'copilot', 'compose', 'rewrite', 'magic write'], [line(L(3.5, 6, 13, 6)), line(L(3.5, 11, 10.5, 11)), line(L(3.5, 16, 9, 16)), spark(16.5, 13.5, 4.5)], { anim: 'pulse' }),
    icon('ai-image', 'AI Image', ['generate image', 'text to image', 'art', 'diffusion'], [body(R(3, 7.5, 13, 13, 2)), line(poly([[3.2, 18], [7.5, 13.5], [10.5, 16.5], [12, 15], [15.8, 19]], 0.5)), spark(18.6, 5.5, 2.4)], { anim: 'pulse' }),
    icon('ai-search', 'AI Search', ['smart search', 'semantic search', 'ask', 'discover'], [body(C(10, 12, 6)), line(L(14.3, 16.3, 18.5, 20.5)), line(star(10, 12, 2.6, 0.85, 4, 0.2)), spark(18.8, 5, 2.3)], { anim: 'pulse' }),
    icon('ai-voice', 'AI Voice', ['voice assistant', 'speech', 'dictation', 'talk to ai'], [body(R(7, 3.5, 6, 11, 3)), line('M4 11.5a6 6 0 0 0 12 0'), line(L(10, 17.5, 10, 20.5)), spark(18.5, 5, 2.5)], { anim: 'pulse' }),
    icon('ai-model', 'AI Model', ['model', 'llm', 'foundation model', 'weights'], [body('M10 8.5l6 3.4v6.8L10 22l-6-3.3v-6.8Z'.replace('22', '20.5')), line('M4.3 12.1 10 15.3l5.7-3.2'), line(L(10, 15.3, 10, 20.2)), spark(18.5, 5, 2.5)]),
    icon('ai-cursor', 'AI Cursor', ['smart select', 'ai action', 'magic click', 'auto'], [body(poly([[5, 4], [17, 10.5], [11.5, 12], [9, 17.5]], 0.6, true)), spark(17.5, 17, 3)], { anim: 'pulse' }),
  ],
};
