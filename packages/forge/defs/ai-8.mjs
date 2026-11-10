import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, star } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-folder', 'AI Folder', ['smart folder', 'auto organise', 'ai files', 'sort files', 'collection'], [body('M3 7.5A2.5 2.5 0 0 1 5.5 5h3.4l2 2h3.6A2.5 2.5 0 0 1 17 9.5v8A2.5 2.5 0 0 1 14.5 20h-9A2.5 2.5 0 0 1 3 17.5Z'), spark(18.5, 4.8, 2.3)], { anim: 'pulse' }),
    icon('ai-support', 'AI Support', ['support bot', 'virtual agent', 'help desk ai', 'customer service', 'assistant'], [line('M5.25 12v-1a6.75 6.75 0 0 1 13.5 0v1'), body(R(3.5, 12, 3.5, 6, 1.5)), body(R(17, 12, 3.5, 6, 1.5)), line('M18.75 18v.5a2 2 0 0 1-2 2H14'), accent(star(12, 12.5, 2.5, 0.85, 4, 0.3))], { anim: 'pulse' }),
    icon('ai-translate', 'AI Translate', ['machine translation', 'language model', 'localise', 'multilingual', 'global'], [body(C(10, 13, 7)), line(E(10, 13, 3, 6.8)), line('M3.2 13h13.6'), spark(18.5, 5, 2.3)], { anim: 'pulse' }),
    icon('ai-cloud', 'AI Cloud', ['cloud ai', 'hosted model', 'ai service', 'inference', 'cloud compute'], [body('M7.5 18.5a4 4 0 0 1-.6-8 5.5 5.5 0 0 1 10.7 1.2 3.4 3.4 0 0 1-.1 6.8Z'), accent(star(12, 14, 2.4, 0.8, 4, 0.3))], { anim: 'pulse' }),
    icon('ai-database', 'AI Knowledge Base', ['vector database', 'embeddings', 'knowledge base', 'rag', 'ai data'], [body('M3.5 7c0-1.7 2.9-3 6.5-3s6.5 1.3 6.5 3v10.5c0 1.7-2.9 3-6.5 3s-6.5-1.3-6.5-3Z'), line('M3.7 7c0 1.7 2.9 3 6.3 3s6.3-1.3 6.3-3'), line('M3.7 12.3c0 1.7 2.9 3 6.3 3s6.3-1.3 6.3-3'), spark(19.5, 4.5, 1.8)], { anim: 'pulse' }),
  ],
};
