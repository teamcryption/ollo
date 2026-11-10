import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('contract-clock', 'Contract Expiry', ['renewal date', 'term end', 'agreement', 'contract', 'contract'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('contract-search', 'Review Contract', ['contract lookup', 'legal review', 'agreement', 'contract', 'contract'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('contract-lock', 'Signed and Sealed', ['executed contract', 'locked agreement', 'final', 'contract', 'contract'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('contract-shield', 'Legal Protection', ['legal cover', 'protected agreement', 'compliance', 'contract', 'contract'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
