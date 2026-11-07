import { D } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'animals',
  icons: [
    icon('bat', 'Bat', ['halloween', 'night', 'cave', 'vampire', 'flying mammal'], [line('M10.8 8.6 10.3 6.5M13.2 8.6l.5-2.1'), body('M12 8.6c-1.2 0-2 .6-2.5 1.4C8 9.6 5.5 9.3 3 8c.5 3 2.3 5.5 4.5 6 .5-1 1.5-1.4 2.5-.9.8.7 1.5 1.9 2 3.9.5-2 1.2-3.2 2-3.9 1-.5 2-.1 2.5.9 2.2-.5 4-3 4.5-6-2.5 1.3-5 1.6-6.5 2-.5-.8-1.3-1.4-2.5-1.4Z')], { noAccent: true, anim: 'wiggle' }),
    icon('jellyfish', 'Jellyfish', ['jelly', 'sea creature', 'tentacles', 'ocean', 'sting'], [body('M6.5 11a5.5 6 0 0 1 11 0v2H6.5Z'), line(D(10, 9.5)), line(D(14, 9.5)), line('M7.5 13c0 3-1.5 5-3 6M10.5 13c0 3 0 5.5-1 7M13.5 13c0 3 0 5.5 1 7M16.5 13c0 3 1.5 5 3 6')], { noAccent: true, anim: 'wiggle' }),
  ],
};
