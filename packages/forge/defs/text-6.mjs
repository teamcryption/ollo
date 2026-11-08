import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'text',
  icons: [
    icon('paragraph', 'Paragraph', ['pilcrow', 'text', 'formatting', 'section', 'typography'], [body('M13.5 4.5H11a4 4 0 0 0 0 8h2.5Z'), line('M13.5 4.5h4M13.5 4.5v15M17 4.5v15')], { noAccent: true }),
  ],
};
