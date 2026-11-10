import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, poly, rotateD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));

export default {
  category: 'sports',
  icons: [
    icon('baseball-bat', 'Baseball Bat', ['baseball', 'softball', 'bat', 'home run', 'sport'], [...rot([body('M10 5a2 2 0 0 1 4 0l-.8 11h-2.4Z'), line('M12 16v3'), body(E(12, 19.8, 1.6, 0.8))], 40, 13, 12), accent(C(6, 6.5, 2.2))]),
    icon('cricket-bat', 'Cricket Bat', ['cricket', 'bat', 'wicket', 'innings', 'sport'], [...rot([body(R(9.5, 9.5, 5, 11, 1.5)), line('M12 9.5V3.5')], 35, 12, 12), accent(C(17.5, 17.5, 2))]),
    icon('ski-boot', 'Ski Boot', ['skiing', 'boot', 'winter sport', 'alpine', 'snow'], [body('M6.5 3.5h7.5l1 6.5 4.5 3.5V18.5h-15v-2.5l2-2Z'), line('M14.3 7h-3M14.8 10.5h-3M3.5 20.5h17')], { noAccent: true }),
  ],
};
