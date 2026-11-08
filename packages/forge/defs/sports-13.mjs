import { icon, body, line, accent } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'sports',
  icons: [
    icon('punching-bag', 'Punching Bag', ['boxing bag', 'heavy bag', 'gym', 'training', 'boxing'], [line('M12 3v2.5M9 7.5l3-2 3 2'), body(R(8, 7.5, 8, 13, 3.5)), line('M8 11h8M8 17h8')], { noAccent: true }),
    icon('treadmill', 'Treadmill', ['running machine', 'cardio', 'gym', 'fitness', 'run'], [body(R(3, 15.5, 15, 4, 2)), line('M16.5 16 19 5.5h1.5'), accent('M4.5 11.5h5M7 8.5h4')]),
  ],
};
