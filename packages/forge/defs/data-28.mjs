import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'data',
  icons: [
    icon('sitemap-question', 'Sitemap Help', ['help', 'question', 'support', 'sitemap', 'sitemap'], [body(R(7, 3, 5, 3.5, 0.8)), body(R(2.5, 13.5, 4.5, 3.5, 0.8)), body(R(12, 13.5, 4.5, 3.5, 0.8)), line('M9.5 6.7V10M4.75 13.3V10h9.5v3.3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('flowchart-question', 'Flowchart Help', ['help', 'question', 'support', 'flowchart', 'flowchart'], [body(R(6, 3, 7, 3.5, 0.8)), body(poly([[9.5, 9], [12, 11], [9.5, 13], [7, 11]], 0.4, true)), body(R(6, 15, 7, 3, 0.8)), line('M9.5 6.7V9M9.5 13.2V15'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('monitor-chart-question', 'Monitor Chart Help', ['help', 'question', 'support', 'monitor chart', 'monitor-chart'], [body(R(3, 3.5, 13, 9.5, 1.5)), line('M6 10V8M9 10V6.5M12 10V8.5'), line('M9.5 13.2v3M6.5 16.5h6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('sitemap-calendar', 'Sitemap Booking', ['booking', 'date', 'appointment', 'sitemap', 'sitemap'], [body(R(7, 3, 5, 3.5, 0.8)), body(R(2.5, 13.5, 4.5, 3.5, 0.8)), body(R(12, 13.5, 4.5, 3.5, 0.8)), line('M9.5 6.7V10M4.75 13.3V10h9.5v3.3'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('flowchart-calendar', 'Flowchart Booking', ['booking', 'date', 'appointment', 'flowchart', 'flowchart'], [body(R(6, 3, 7, 3.5, 0.8)), body(poly([[9.5, 9], [12, 11], [9.5, 13], [7, 11]], 0.4, true)), body(R(6, 15, 7, 3, 0.8)), line('M9.5 6.7V9M9.5 13.2V15'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('monitor-chart-calendar', 'Monitor Chart Booking', ['booking', 'date', 'appointment', 'monitor chart', 'monitor-chart'], [body(R(3, 3.5, 13, 9.5, 1.5)), line('M6 10V8M9 10V6.5M12 10V8.5'), line('M9.5 13.2v3M6.5 16.5h6'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('sitemap-sparkle', 'AI Sitemap', ['ai', 'smart', 'magic', 'sitemap', 'sitemap'], [body(R(7, 3, 5, 3.5, 0.8)), body(R(2.5, 13.5, 4.5, 3.5, 0.8)), body(R(12, 13.5, 4.5, 3.5, 0.8)), line('M9.5 6.7V10M4.75 13.3V10h9.5v3.3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('flowchart-sparkle', 'AI Flowchart', ['ai', 'smart', 'magic', 'flowchart', 'flowchart'], [body(R(6, 3, 7, 3.5, 0.8)), body(poly([[9.5, 9], [12, 11], [9.5, 13], [7, 11]], 0.4, true)), body(R(6, 15, 7, 3, 0.8)), line('M9.5 6.7V9M9.5 13.2V15'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('monitor-chart-sparkle', 'AI Monitor Chart', ['ai', 'smart', 'magic', 'monitor chart', 'monitor-chart'], [body(R(3, 3.5, 13, 9.5, 1.5)), line('M6 10V8M9 10V6.5M12 10V8.5'), line('M9.5 13.2v3M6.5 16.5h6'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
