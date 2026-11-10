import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'nature',
  icons: [
    icon('hills', 'Hills', ['landscape', 'countryside', 'rolling hills', 'meadow', 'outdoors'], [body('M3.5 19.5v-3a5.5 5.5 0 0 1 10-3.2 5.5 5.5 0 0 1 7 4.2v2Z'), accent(C(17, 6.5, 2))]),
    icon('bird-feeder', 'Bird Feeder', ['birds', 'seeds', 'garden', 'feeding', 'backyard'], [line('M12 3v2'), body(poly([[12, 5], [19.5, 9.5], [4.5, 9.5]], 1, true)), body(R(8, 10.5, 8, 5.5, 1)), body(R(5, 16.5, 14, 2.5, 1)), accent(D(8, 21) + D(12, 21) + D(16, 21))]),
    icon('bird-bath', 'Bird Bath', ['garden', 'birds', 'fountain', 'water', 'backyard'], [body('M3.5 8.5h17c0 2.5-3.8 4-8.5 4s-8.5-1.5-8.5-4Z'), body(poly([[10.5, 12.5], [13.5, 12.5], [14.5, 18], [9.5, 18]], 0.6, true)), body(R(7, 18, 10, 2.5, 1)), accent('M12 3c-.8 1-1.3 1.6-1.3 2.2a1.3 1.3 0 0 0 2.6 0c0-.6-.5-1.2-1.3-2.2Z')]),
  ],
};
