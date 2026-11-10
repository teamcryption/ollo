import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, poly } from '../src/geo.mjs';

const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];

export default {
  category: 'interface',
  icons: [
    icon('home-search', 'Home Search', ['house hunting', 'find property', 'real estate', 'listings', 'search homes'], [body(poly([[3, 10.5], [9.5, 4.5], [16, 10.5], [16, 18.5], [3, 18.5]], 1, true)), ...LENS], { noAccent: true }),
    icon('image-search', 'Image Search', ['reverse image', 'find photo', 'visual search', 'gallery search', 'lookup'], [body(R(3, 4, 14, 11.5, 2)), line('M5.5 12.5l2.8-2.8 2.2 2.2'), line(D(13, 7.5)), ...LENS], { noAccent: true }),
    icon('calendar-search', 'Find Event', ['search calendar', 'find date', 'event lookup', 'schedule search', 'agenda'], [body(R(3, 5, 13.5, 13, 2.5)), line('M3.2 9h13.1M6.5 3.5v3M13 3.5v3'), ...LENS], { noAccent: true }),
    icon('card-clock', 'Scheduled Payment', ['autopay', 'recurring payment', 'pay later', 'direct debit', 'billing'], [body(R(3, 5, 15, 10, 2)), line('M3.2 8.5h14.6'), ...CLOCK], { noAccent: true }),
  ],
};
