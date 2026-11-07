import { icon, line } from '../src/dsl.mjs';

export default {
  category: 'arrows',
  icons: [
    icon('arrows-converge', 'Converge Arrows', ['converge', 'meet', 'centre', 'join', 'squeeze'], [line('M3.5 12h6'), line('M7 9.5 9.5 12 7 14.5'), line('M20.5 12h-6'), line('M17 9.5 14.5 12 17 14.5'), line('M12 5v14')], { noAccent: true }),
    icon('arrows-diverge', 'Diverge Arrows', ['diverge', 'spread', 'separate', 'push apart', 'widen'], [line('M12 5v14'), line('M14.5 12h6'), line('M18 9.5l2.5 2.5-2.5 2.5'), line('M9.5 12h-6'), line('M6 9.5 3.5 12 6 14.5')], { noAccent: true }),
  ],
};
