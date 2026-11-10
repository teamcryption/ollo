import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'science',
  icons: [
    icon('pipette', 'Pipette', ['dropper', 'lab', 'chemistry', 'sample', 'liquid'], [body(E(12, 5.5, 2.5, 2.5)), body(R(10.8, 8, 2.4, 9.5, 0.8)), line('M12 17.5V19'), accent(D(12, 21))]),
    icon('test-tube-rack', 'Test Tube Rack', ['lab', 'samples', 'chemistry', 'tubes', 'laboratory'], [body(R(6, 3.5, 3, 14, 1.5) + R(10.5, 3.5, 3, 14, 1.5) + R(15, 3.5, 3, 14, 1.5)), body(R(3.5, 10, 17, 2.5, 1), { cover: true }), line('M4.5 12.5v8M19.5 12.5v8M3.5 20.5h17')], { noAccent: true }),
  ],
};
