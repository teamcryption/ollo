import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, L, poly, rotateD } from '../src/geo.mjs';

export default {
  category: 'tools',
  icons: [
    icon('c-clamp', 'C-Clamp', ['clamp', 'vise', 'grip', 'woodworking', 'workshop'], [line('M13.5 4H9.5A4.5 4.5 0 0 0 5 8.5v5A4.5 4.5 0 0 0 9.5 18H17M15.5 20.5V11.5M13 20.5h5'), body(R(13.5, 3, 4.5, 2.6, 0.8)), body(R(13.5, 9.5, 4, 2, 0.8))], { noAccent: true }),
    icon('glue-gun', 'Glue Gun', ['hot glue', 'craft', 'adhesive', 'diy', 'tool'], [body('M4 6.5h11.5a2 2 0 0 1 2 2V12H11l-1 8.5H6.5L7.5 12H4Z'), line('M17.5 9.2h3'), accent('M20 13c.7.9 1 1.5 1 2a1 1 0 0 1-2 0c0-.5.3-1.1 1-2Z')]),
    icon('utility-knife', 'Utility Knife', ['box cutter', 'blade', 'craft knife', 'cutter', 'tool'], [body(rotateD('M3.5 10.5h12.5l-1.5 4.5H5a1.5 1.5 0 0 1-1.5-1.5Z', -30)), body(rotateD(poly([[16.5, 10.5], [20.5, 10.5], [18, 15], [15, 15]], 0.5, true), -30)), accent(rotateD(L(7, 12.8, 10.5, 12.8), -30))]),
  ],
};
