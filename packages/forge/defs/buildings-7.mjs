import { icon, body } from '../src/dsl.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('stairs', 'Stairs', ['steps', 'staircase', 'upstairs', 'climb', 'floor'], [body('M3.5 20.5V16h4.5v-4.5h4.5V7h4.5V3.5h3.5v17Z')], { noAccent: true }),
  ],
};
