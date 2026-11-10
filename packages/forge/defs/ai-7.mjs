import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, poly, star } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-tag', 'AI Tagging', ['auto tag', 'smart labels', 'classify', 'categorise', 'metadata'], [body(poly([[3.5, 8], [13, 8], [17.5, 12.5], [13, 17], [3.5, 17]], 1.2, true)), line(D(7, 12.5)), spark(18.5, 5.5, 2.3)], { anim: 'pulse' }),
    icon('ai-calendar', 'AI Scheduling', ['smart schedule', 'auto plan', 'calendar assistant', 'meeting finder', 'planner'], [body(R(3, 6.5, 14, 13.5, 2.5)), line('M3.2 10.5h13.6'), line('M7 4.5v3.5M13 4.5v3.5'), line(D(7, 14) + D(10, 14) + D(13, 14) + D(7, 17) + D(10, 17)), spark(19.5, 4.5, 2)], { anim: 'pulse' }),
    icon('ai-idea', 'AI Idea', ['brainstorm', 'generate ideas', 'inspiration', 'creative ai', 'suggestion'], [body('M12 3.5a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2v.5h5v-.5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3.5Z'), line('M9.5 19h5M10.5 21h3'), accent(star(12, 9.5, 2.6, 0.9, 4, 0.3))], { anim: 'pulse' }),
    icon('ai-fine-tune', 'Fine-tune', ['fine tuning', 'model settings', 'adjust model', 'train', 'parameters'], [line('M3.5 7h3M10.5 7h3'), body(C(8.5, 7, 2)), line('M3.5 12.5h9M16.5 12.5h4'), body(C(14.5, 12.5, 2)), line('M3.5 18h3M10.5 18h10'), body(C(8.5, 18, 2)), spark(18.5, 6, 2.4)], { anim: 'pulse' }),
    icon('ai-shield', 'AI Safety', ['ai security', 'guardrails', 'safe ai', 'protection', 'trust'], [body('M12 3.5 18.5 6v5.3c0 4.2-2.7 7.7-6.5 9.2-3.8-1.5-6.5-5-6.5-9.2V6Z'), accent(star(12, 11.5, 3, 1, 4, 0.3))], { anim: 'pulse' }),
  ],
};
