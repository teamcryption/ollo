import { icon, line, accent } from '../src/dsl.mjs';

export default {
  category: 'ai',
  icons: [
    icon('ai-code', 'AI Code', ['code assistant', 'copilot', 'generate code', 'smart code', 'autocomplete'], [line('M7.5 4.5c-1.5 0-2 .8-2 2v3c0 1-.7 1.8-2 2.5 1.3.7 2 1.5 2 2.5v3c0 1.2.5 2 2 2'), line('M16.5 4.5c1.5 0 2 .8 2 2v3c0 1 .7 1.8 2 2.5-1.3.7-2 1.5-2 2.5v3c0 1.2-.5 2-2 2'), accent('M12 8.5c.3 2 1.2 3.2 3.5 3.5-2.3.3-3.2 1.5-3.5 3.5-.3-2-1.2-3.2-3.5-3.5 2.3-.3 3.2-1.5 3.5-3.5Z')], { anim: 'pulse' }),
  ],
};
