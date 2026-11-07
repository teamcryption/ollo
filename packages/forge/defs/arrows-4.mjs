import { icon, line } from '../src/dsl.mjs';

export default {
  category: 'arrows',
  icons: [
    icon('arrows-merge', 'Merge Arrows', ['merge', 'combine', 'join', 'converge', 'funnel'], [line('M6 20.5c0-4 6-5 6-10'), line('M18 20.5c0-4-6-5-6-10'), line('M12 10.5V4'), line('M8.5 7.5 12 4l3.5 3.5')], { noAccent: true }),
    icon('arrow-curve-right', 'Curved Arrow', ['curve', 'bend', 'redirect', 'route', 'turn'], [line('M5 19.5c0-6.5 4-10.5 11-10.5'), line('M12.5 5.5 16 9l-3.5 3.5')], { noAccent: true }),
    icon('arrows-diagonal', 'Diagonal Arrows', ['resize', 'scale', 'enlarge', 'stretch', 'diagonal'], [line('M6 18 18 6'), line('M12.5 5.5H18.5V11.5'), line('M11.5 18.5H5.5V12.5')], { noAccent: true }),
  ],
};
