import { R } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'science',
  icons: [
    icon('bunsen-burner', 'Bunsen Burner', ['burner', 'lab flame', 'chemistry', 'heat', 'experiment'], [body(R(10.5, 10.8, 3, 7.2, 0.5)), body(R(6.5, 18, 11, 2.5, 1)), line('M13.7 14.5h2.8a1.5 1.5 0 0 1 1.5 1.5v1.8'), accent('M12 3.5c-1.3 1.3-2 2.3-2 3.2a2 2 0 0 0 4 0c0-.9-.7-1.9-2-3.2Z')], { anim: 'wiggle' }),
  ],
};
