import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'tools',
  icons: [
    icon('nail', 'Nail', ['hardware', 'carpentry', 'fastener', 'hammer', 'diy'], [line('M8 4h8'), body('M10.8 5.5h2.4V16.5l-1.2 3.5-1.2-3.5Z'), accent('M5.5 9.5 4 8.5M18.5 9.5l1.5-1')]),
    icon('bolt', 'Bolt', ['hex bolt', 'fastener', 'hardware', 'thread', 'nut and bolt'], [body(R(6.5, 3.5, 11, 5, 1.2)), line('M10 3.7v4.6M14 3.7v4.6'), body(R(9.5, 8.5, 5, 12, 1)), line('M9.7 12h4.6M9.7 14.7h4.6M9.7 17.4h4.6')], { noAccent: true }),
    icon('hinge', 'Hinge', ['door hinge', 'hardware', 'pivot', 'joint', 'cabinet'], [body(R(3.5, 6, 7.5, 12, 1.2)), body(R(13, 6, 7.5, 12, 1.2)), body(R(10.5, 3.5, 3, 17, 1.5), { cover: true }), line(D(7.2, 9) + D(7.2, 15) + D(16.8, 9) + D(16.8, 15))], { noAccent: true }),
    icon('anvil', 'Anvil', ['blacksmith', 'forge', 'metalwork', 'smithing', 'heavy'], [body('M3.5 6H20.5V10H15L14.5 15.5H17V20H7V15.5H9.5L9 11.5C6 11 4 9 3.5 6Z')], { noAccent: true }),
    icon('putty-knife', 'Putty Knife', ['scraper', 'spackle', 'drywall', 'painting', 'diy'], [body(R(10.5, 3.5, 3, 8, 1.5)), line('M9.5 12h5'), body('M9 13.5h6l2 7H7Z')], { noAccent: true }),
  ],
};
