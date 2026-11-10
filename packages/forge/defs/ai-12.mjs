import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, star } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-browser', 'AI Browser', ['agentic browser', 'web agent', 'browse with ai', 'ai web', 'assistant'], [body(R(3, 6, 13.5, 13, 2.5)), line('M3.2 10h13.1'), line('M6 14.5h7'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-form', 'AI Autofill', ['smart form', 'auto fill', 'form assistant', 'fill fields', 'data entry'], [body(R(3.5, 4, 12, 16.5, 2.5)), line(R(6, 7, 7, 2.5, 0.8)), line(R(6, 12, 7, 2.5, 0.8)), line('M6 17.5h4'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-notes', 'AI Notes', ['meeting notes', 'smart notes', 'note taker', 'transcribe', 'summary'], [body('M5.5 4h8A2 2 0 0 1 15.5 6v9.5l-4 4h-6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'), line('M15.3 15.5h-2.3a1.5 1.5 0 0 0-1.5 1.5v2.3'), line('M6.5 8.5h6M6.5 11.5h4'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-gift', 'AI Gift Ideas', ['gift finder', 'present ideas', 'smart shopping', 'occasions', 'ai picks'], [body(R(3, 9, 13, 11, 1.5)), line('M9.5 9.2v10.6M3.2 12.5h12.6'), line('M9.5 9C8.5 6.5 6 5.5 5.5 7.3S8 9 9.5 9c1.5 0 4.5-.5 4-1.7S10.5 6.5 9.5 9'), spark(19.5, 5, 2)], { anim: 'pulse' }),
  ],
};
