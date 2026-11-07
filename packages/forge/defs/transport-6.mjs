import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('rowboat', 'Rowboat', ['rowing boat', 'dinghy', 'oars', 'lake', 'paddle boat'], [line('M9.5 14 5 6M14.5 14 19 6'), body('M3 13h18l-2.5 5.5h-13Z', { cover: true })], { noAccent: true }),
  ],
};
