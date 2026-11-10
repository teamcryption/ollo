import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'media',
  icons: [
    icon('tuning-fork', 'Tuning Fork', ['pitch', 'tuning', 'resonance', 'music', 'frequency'], [line('M9 3.5v8a3 3 0 0 0 6 0v-8M12 14.5v6'), accent('M5.5 6c-1 1-1 3 0 4M18.5 6c1 1 1 3 0 4')]),
    icon('tambourine', 'Tambourine', ['percussion', 'jingle', 'shake', 'folk', 'instrument'], [line(C(12, 12, 7)), body(R(10.5, 4, 3, 2, 0.6) + R(10.5, 18, 3, 2, 0.6) + R(4, 10.5, 2, 3, 0.6) + R(18, 10.5, 2, 3, 0.6), { cover: true })], { noAccent: true }),
    icon('triangle-instrument', 'Triangle', ['percussion', 'orchestra', 'ding', 'chime', 'instrument'], [line('M11 3v2M10.3 5 4 17.5h13.5M11.7 5l6.5 11'), accent('M3.5 9l4-3')]),
    icon('bongo', 'Bongos', ['bongo drums', 'percussion', 'latin', 'hand drum', 'rhythm'], [body(poly([[3.5, 8], [11, 8], [10, 20.5], [4.5, 20.5]], 1.5, true)), body(poly([[13, 10.5], [20.5, 10.5], [19.5, 20.5], [14, 20.5]], 1.5, true)), line('M3.9 10.5h6.7M13.4 13h6.7')], { noAccent: true }),
    icon('gong', 'Gong', ['percussion', 'meditation', 'temple', 'announce', 'instrument'], [line('M4 20.5V4.5h16v16'), line('M9.5 4.5v3M14.5 4.5v3'), body(C(12, 12.5, 5))], { noAccent: true }),
    icon('music-stand', 'Music Stand', ['sheet music', 'orchestra', 'rehearsal', 'score', 'concert'], [body(poly([[4, 4], [20, 4], [19, 11], [5, 11]], 1, true)), line('M7.5 7.5h9'), line('M12 11v6.5M12 17.5l-4.5 3M12 17.5l4.5 3M12 17.5v3')], { noAccent: true }),
    icon('sheet-music', 'Sheet Music', ['score', 'notation', 'composition', 'notes', 'music'], [body(R(5, 3.5, 14, 17, 2)), line('M8 7.5h8M8 10h8'), accent(C(10, 16, 1.3) + 'M11.3 16v-4')]),
    icon('synthesizer', 'Synthesizer', ['synth', 'keyboard', 'electronic music', 'keys', 'producer'], [body(R(3.5, 6, 17, 12, 2)), line('M3.7 11h16.6M7.5 11v6.8M11.5 11v6.8M15.5 11v6.8'), line(D(6.5, 8.5) + D(9.5, 8.5) + D(12.5, 8.5)), line('M15.5 8.5h2.5')], { noAccent: true }),
  ],
};
