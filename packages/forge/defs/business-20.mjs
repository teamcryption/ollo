import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('clipboard-clock', 'Shift Schedule', ['task schedule', 'rota', 'checklist timing', 'clipboard', 'clipboard'], [body(R(4, 4.5, 10, 13, 2)), body(R(6.5, 3, 5, 2.5, 1), { cover: true }), line('M6.5 9h5M6.5 12h3'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('clipboard-search', 'Audit', ['inspection', 'review checklist', 'compliance check', 'clipboard', 'clipboard'], [body(R(4, 4.5, 10, 13, 2)), body(R(6.5, 3, 5, 2.5, 1), { cover: true }), line('M6.5 9h5M6.5 12h3'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('clipboard-lock', 'Locked Checklist', ['final checklist', 'sign off', 'secure form', 'clipboard', 'clipboard'], [body(R(4, 4.5, 10, 13, 2)), body(R(6.5, 3, 5, 2.5, 1), { cover: true }), line('M6.5 9h5M6.5 12h3'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('clipboard-shield', 'Compliance', ['safety checklist', 'regulations', 'approved', 'clipboard', 'clipboard'], [body(R(4, 4.5, 10, 13, 2)), body(R(6.5, 3, 5, 2.5, 1), { cover: true }), line('M6.5 9h5M6.5 12h3'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
