import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'data',
  icons: [
    icon('dashboard-bookmark', 'Save Dashboard', ['save', 'bookmark', 'later', 'dashboard', 'dashboard'], [body(R(3, 4, 5.5, 6, 1)), body(R(10, 4, 5.5, 4, 1)), body(R(3, 11.5, 5.5, 5, 1)), body(R(10, 9.5, 5.5, 7, 1)), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('chart-bookmark', 'Save Chart', ['save', 'bookmark', 'later', 'chart', 'chart'], [body(R(3, 10, 3, 6, 0.8)), body(R(7.5, 7, 3, 9, 0.8)), body(R(12, 4, 3, 12, 0.8)), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('table-bookmark', 'Save Table', ['save', 'bookmark', 'later', 'table', 'table'], [body(R(3, 4.5, 13, 12, 1.5)), line('M3.2 8.5h12.6M3.2 12.5h12.6M8 8.7v7.6'), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('pie-chart-bookmark', 'Save Pie Chart', ['save', 'bookmark', 'later', 'pie chart', 'pie-chart'], [body('M9 4.5a6.5 6.5 0 1 0 6.5 6.5H9Z'), line('M11 3a6 6 0 0 1 5 5h-5Z'), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('gauge-bookmark', 'Save Gauge', ['save', 'bookmark', 'later', 'gauge', 'gauge'], [line('M3.5 14a6 6 0 0 1 12 0'), line('M9.5 14l3-3.5'), line('M3.5 17h12'), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('funnel-bookmark', 'Save Funnel', ['save', 'bookmark', 'later', 'funnel', 'funnel'], [body('M3.5 4.5h12l-4.5 6v6l-3 1.5v-7.5Z'), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('sitemap-bookmark', 'Save Sitemap', ['save', 'bookmark', 'later', 'sitemap', 'sitemap'], [body(R(7, 3, 5, 3.5, 0.8)), body(R(2.5, 13.5, 4.5, 3.5, 0.8)), body(R(12, 13.5, 4.5, 3.5, 0.8)), line('M9.5 6.7V10M4.75 13.3V10h9.5v3.3'), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('flowchart-bookmark', 'Save Flowchart', ['save', 'bookmark', 'later', 'flowchart', 'flowchart'], [body(R(6, 3, 7, 3.5, 0.8)), body(poly([[9.5, 9], [12, 11], [9.5, 13], [7, 11]], 0.4, true)), body(R(6, 15, 7, 3, 0.8)), line('M9.5 6.7V9M9.5 13.2V15'), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('monitor-chart-bookmark', 'Save Monitor Chart', ['save', 'bookmark', 'later', 'monitor chart', 'monitor-chart'], [body(R(3, 3.5, 13, 9.5, 1.5)), line('M6 10V8M9 10V6.5M12 10V8.5'), line('M9.5 13.2v3M6.5 16.5h6'), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('dashboard-question', 'Dashboard Help', ['help', 'question', 'support', 'dashboard', 'dashboard'], [body(R(3, 4, 5.5, 6, 1)), body(R(10, 4, 5.5, 4, 1)), body(R(3, 11.5, 5.5, 5, 1)), body(R(10, 9.5, 5.5, 7, 1)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('chart-question', 'Chart Help', ['help', 'question', 'support', 'chart', 'chart'], [body(R(3, 10, 3, 6, 0.8)), body(R(7.5, 7, 3, 9, 0.8)), body(R(12, 4, 3, 12, 0.8)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('table-question', 'Table Help', ['help', 'question', 'support', 'table', 'table'], [body(R(3, 4.5, 13, 12, 1.5)), line('M3.2 8.5h12.6M3.2 12.5h12.6M8 8.7v7.6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('pie-chart-question', 'Pie Chart Help', ['help', 'question', 'support', 'pie chart', 'pie-chart'], [body('M9 4.5a6.5 6.5 0 1 0 6.5 6.5H9Z'), line('M11 3a6 6 0 0 1 5 5h-5Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('gauge-question', 'Gauge Help', ['help', 'question', 'support', 'gauge', 'gauge'], [line('M3.5 14a6 6 0 0 1 12 0'), line('M9.5 14l3-3.5'), line('M3.5 17h12'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('funnel-question', 'Funnel Help', ['help', 'question', 'support', 'funnel', 'funnel'], [body('M3.5 4.5h12l-4.5 6v6l-3 1.5v-7.5Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
  ],
};
