import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

const sector = (a0, a1, r0, r1) => { const p = (r, a) => [12 + r * Math.cos((a * Math.PI) / 180), 12 + r * Math.sin((a * Math.PI) / 180)].map((v) => v.toFixed(2)).join(' '); return `M${p(r0, a0)}L${p(r1, a0)}A${r1} ${r1} 0 0 1 ${p(r1, a1)}L${p(r0, a1)}A${r0} ${r0} 0 0 0 ${p(r0, a0)}Z`; };

export default {
  category: 'science',
  icons: [
    icon('spring', 'Spring', ['coil', 'elastic', 'bounce', 'physics', 'mechanical'], [line('M12 3.5v2M8 5.5h8l-8 3h8l-8 3h8l-8 3h8l-8 3h8M12 17.5v3')], { noAccent: true }),
    icon('pulley', 'Pulley', ['lift', 'physics', 'rope', 'hoist', 'mechanics'], [line('M12 3v2.5'), body(C(12, 8.5, 3)), line(D(12, 8.5)), line('M9 8.5v11M15 8.5v4.5'), body(R(13, 13, 4, 4.5, 1))], { noAccent: true }),
    icon('pendulum', 'Pendulum', ['swing', 'physics', 'oscillation', 'gravity', 'clock'], [line('M5 3.5h14M12 3.5l3.5 11.5'), body(C(16.2, 17.3, 2.6)), accent('M7 15.5q1.5 2.5 4 3.5')]),
    icon('lens', 'Lens', ['optics', 'convex lens', 'focus', 'refraction', 'light'], [body('M12 3.5c2.5 3 2.5 14 0 17-2.5-3-2.5-14 0-17Z'), line('M3.5 8.5h5.5M3.5 15.5h5.5'), accent('M16 8.5 20.5 12M16 15.5 20.5 12')]),
    icon('crystal', 'Crystal', ['quartz', 'mineral', 'gem', 'geology', 'healing'], [...rot([body(poly([[6.5, 20.5], [6.5, 12], [8, 9], [9.5, 12], [9.5, 20.5]], 0.5, true))], -20, -1, -1.4), ...rot([body(poly([[14.5, 20.5], [14.5, 12], [16, 9], [17.5, 12], [17.5, 20.5]], 0.5, true))], 20, 1, -1.4), body(poly([[10, 20.5], [10, 8], [12, 3.5], [14, 8], [14, 20.5]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
