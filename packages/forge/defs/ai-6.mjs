import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L, poly, star, translateD } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-video', 'AI Video', ['generate video', 'text to video', 'video model', 'synthetic media', 'clip'], [body(R(3, 8, 12, 10, 2.5)), body(poly([[15.8, 11.5], [20.5, 9], [20.5, 17], [15.8, 14.5]], 0.8, true)), spark(18.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-chart', 'AI Insights', ['smart analytics', 'insights', 'ai report', 'auto chart', 'analysis'], [body(R(4, 13, 4, 7, 1.2)), body(R(10, 9, 4, 11, 1.2)), body(R(16, 15, 4, 5, 1.2)), spark(18, 6.5, 3)], { anim: 'pulse' }),
    icon('ai-mail', 'AI Email', ['smart compose', 'email assistant', 'draft email', 'reply', 'inbox ai'], [body(R(3, 7.5, 14, 11, 2.5)), line('M6 11l3.2 2.3c.5.4 1.1.4 1.6 0L14 11'), spark(18.5, 5.5, 2.3)], { anim: 'pulse' }),
    icon('ai-agent', 'AI Agent', ['agent', 'autonomous', 'assistant', 'copilot', 'digital worker'], [body(C(10, 8, 3.5)), body(translateD('M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z', -2, 0)), spark(18.5, 8, 2.6)], { anim: 'pulse' }),
    icon('ai-vision', 'Computer Vision', ['image recognition', 'detection', 'ai eye', 'vision model', 'see'], [line('M3.5 7.5V5.5a2 2 0 0 1 2-2h2M16.5 3.5h2a2 2 0 0 1 2 2v2M20.5 16.5v2a2 2 0 0 1-2 2h-2M7.5 20.5h-2a2 2 0 0 1-2-2v-2'), body('M6 12c1.4-2.9 3.5-4.3 6-4.3s4.6 1.4 6 4.3c-1.4 2.9-3.5 4.3-6 4.3S7.4 14.9 6 12Z'), accent(star(12, 12, 2.2, 0.75, 4, 0.3))], { anim: 'pulse' }),
    icon('ai-music', 'AI Music', ['generate music', 'ai composer', 'song', 'audio model', 'melody'], [body(C(8, 17, 3)), line('M11 17V4.5c2 .5 4 1.8 4 4.5'), spark(17.5, 14.5, 2.5)], { anim: 'pulse' }),
  ],
};
