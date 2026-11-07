import { star } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { PAGE, FOLD } from './files.mjs';

export default {
  category: 'ai',
  icons: [
    icon('ai-document', 'AI Document', ['generate document', 'ai writing', 'smart doc', 'summarise', 'draft'], [body(PAGE), line(FOLD), accent(star(12, 14.5, 3.8, 1.1, 4, 0.3))], { anim: 'pulse' }),
  ],
};
