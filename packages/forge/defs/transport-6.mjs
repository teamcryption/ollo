import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('rowboat', 'Rowboat', ['rowing boat', 'dinghy', 'oars', 'lake', 'paddle boat'], [line('M9.5 12.5 5 4.5M14.5 12.5 19 4.5'), body('M3 11.5h18l-2.5 5.5h-13Z', { cover: true }), line('M3.5 20c1.4-1 2.8-1 4.2 0s2.8 1 4.2 0 2.8-1 4.2 0 2.8 1 4.2 0')], { noAccent: true }),
  ],
};
