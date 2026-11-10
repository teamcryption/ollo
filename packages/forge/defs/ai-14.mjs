import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, star } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-scan', 'AI Scan', ['smart scan', 'ocr', 'document capture', 'recognise', 'scanner'], [line('M3.5 8V6A2.5 2.5 0 0 1 6 3.5h2M3.5 15v2A2.5 2.5 0 0 0 6 19.5h2M12 19.5h2a2.5 2.5 0 0 0 2.5-2.5v-2'), line('M6.5 11.5h7'), spark(18.5, 5.5, 2.4)], { anim: 'pulse' }),
    icon('ai-graph', 'Knowledge Graph', ['ai graph', 'entities', 'relationships', 'semantic', 'ontology'], [body(C(6, 7, 2)), body(C(13, 9.5, 2)), body(C(7, 17, 2)), body(C(15.5, 17.5, 2)), line('M7.9 7.7 11.1 8.8M12.2 11.4l-4.2 3.8M14 11.3l.8 4.3M9 17.1h4.5'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-contract', 'AI Contract Review', ['legal ai', 'contract analysis', 'clause check', 'review', 'agreement'], [body(R(3.5, 4, 12, 16.5, 2.5)), line('M6.5 8h6M6.5 11h6'), line('M6.5 16c1-1.5 1.8-1.5 2.3 0s1.3 1.5 2.2 0'), spark(19.5, 5, 2)], { anim: 'pulse' }),
  ],
};
