import { icon, body, line, accent } from '../src/dsl.mjs';
import { D } from '../src/geo.mjs';

export default {
  category: 'animals',
  icons: [
    icon('beehive', 'Beehive', ['hive', 'skep', 'bees', 'honey', 'apiary'], [body('M5 19.5c0-8.5 2.8-15 7-15s7 6.5 7 15Z'), line('M5.6 15h12.8M7 10.5h10'), line('M10.5 19.5V18a1.5 1.5 0 0 1 3 0v1.5'), line('M3.5 19.5h17')], { noAccent: true }),
    icon('octopus', 'Octopus', ['sea', 'ocean', 'tentacles', 'marine', 'squid'], [body('M6 12a6 6 0 0 1 12 0v2H6Z'), line('M7 14c0 3-2 4-3 4.5M10 14c0 3-1 5-2 6.5M14 14c0 3 1 5 2 6.5M17 14c0 3 2 4 3 4.5'), accent(D(10, 10.5) + D(14, 10.5))]),
  ],
};
