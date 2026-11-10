import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'tools',
  icons: [
    icon('sledgehammer', 'Sledgehammer', ['sledge', 'demolition', 'heavy hammer', 'smash', 'construction'], rot([body(R(5.5, 3.5, 13, 6.5, 2)), body(R(10.8, 10, 2.4, 10.5, 1.2))], -30, 1.2, 1.1), { noAccent: true }),
    icon('mallet', 'Mallet', ['rubber mallet', 'gavel', 'woodworking', 'tool', 'tap'], [body(R(4, 4, 16, 7, 3.5)), line('M7.5 4.2v6.6M16.5 4.2v6.6M12 11v9.5')], { noAccent: true }),
    icon('multimeter', 'Multimeter', ['voltmeter', 'electrician', 'tester', 'measure', 'electronics'], [body(R(5.5, 3, 13, 18, 2.5)), line(R(8, 5.5, 8, 4.5, 1)), line(C(12, 14.2, 2.8)), line('M12 14.2l1.5-1.5'), line(D(9, 18.8) + D(15, 18.8))], { noAccent: true }),
    icon('soldering-iron', 'Soldering Iron', ['solder', 'electronics', 'repair', 'diy', 'hardware'], rot([line('M12 8.5V3.5'), body(R(10.6, 8.5, 2.8, 2.5, 0.6)), body(R(10, 11, 4, 9.5, 2))], 45), { noAccent: true }),
  ],
};
