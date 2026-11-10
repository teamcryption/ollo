import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'nature',
  icons: [
    icon('dandelion', 'Dandelion', ['wish', 'seeds', 'flower', 'spring', 'weed'], [line('M12 6.7V3.5M13.27 7.23l2.27-2.27M13.8 8.5H17M13.27 9.77l2.27 2.27M10.73 9.77 8.46 12.04M10.2 8.5H7M10.73 7.23 8.46 4.96'), body(C(12, 8.5, 1.3)), line('M12 9.8v10.7'), accent('M18.2 5.8 20 4')]),
    icon('lavender', 'Lavender', ['herb', 'flower', 'purple', 'aromatherapy', 'calm'], [body(E(12, 4.5, 1, 1.5)), body(E(10.8, 7.5, 1, 1.5)), body(E(13.2, 7.5, 1, 1.5)), body(E(10.8, 10.5, 1, 1.5)), body(E(13.2, 10.5, 1, 1.5)), line('M12 12v8.5M12 17c-1.5-1-3-1.2-4.5-1M12 15.5c1.5-1 3-1.2 4.5-1')], { noAccent: true }),
    icon('kelp', 'Kelp', ['seaweed', 'ocean', 'underwater', 'algae', 'marine'], [line('M8 20.5c-2-4 2-6 0-10s1-5 1-7M14 20.5c2-3-1.5-6 .5-9s.5-5-1-7'), accent(C(18.5, 6, 1) + C(19.5, 9.5, 0.8))]),
    icon('herb', 'Herb', ['basil', 'mint', 'leaves', 'cooking', 'garden'], [line('M12 20.5V5.5'), body('M12 16c-3.5 0-5.5-2-6-4.5 3.5 0 5.5 2 6 4.5Z'), body('M12 16c3.5 0 5.5-2 6-4.5-3.5 0-5.5 2-6 4.5Z'), body('M12 10.5c-2.8 0-4.5-1.6-5-3.6 2.8 0 4.5 1.6 5 3.6Z'), body('M12 10.5c2.8 0 4.5-1.6 5-3.6-2.8 0-4.5 1.6-5 3.6Z')], { noAccent: true }),
    icon('log-pile', 'Log Pile', ['firewood', 'logs', 'lumber', 'woodpile', 'cabin'], [body(C(7.5, 16.5, 3.5)), body(C(16.5, 16.5, 3.5)), body(C(12, 9.5, 3.5)), line(C(7.5, 16.5, 1.3) + C(16.5, 16.5, 1.3) + C(12, 9.5, 1.3))], { noAccent: true }),
  ],
};
