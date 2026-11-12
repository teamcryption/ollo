import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'data',
  icons: [
    icon('dashboard-crown', 'Premium Dashboard', ['premium', 'pro', 'vip', 'dashboard', 'dashboard'], [body(R(3, 4, 5.5, 6, 1)), body(R(10, 4, 5.5, 4, 1)), body(R(3, 11.5, 5.5, 5, 1)), body(R(10, 9.5, 5.5, 7, 1)), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('chart-crown', 'Premium Chart', ['premium', 'pro', 'vip', 'chart', 'chart'], [body(R(3, 10, 3, 6, 0.8)), body(R(7.5, 7, 3, 9, 0.8)), body(R(12, 4, 3, 12, 0.8)), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('table-crown', 'Premium Table', ['premium', 'pro', 'vip', 'table', 'table'], [body(R(3, 4.5, 13, 12, 1.5)), line('M3.2 8.5h12.6M3.2 12.5h12.6M8 8.7v7.6'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('pie-chart-crown', 'Premium Pie Chart', ['premium', 'pro', 'vip', 'pie chart', 'pie-chart'], [body('M9 4.5a6.5 6.5 0 1 0 6.5 6.5H9Z'), line('M11 3a6 6 0 0 1 5 5h-5Z'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('gauge-crown', 'Premium Gauge', ['premium', 'pro', 'vip', 'gauge', 'gauge'], [line('M3.5 14a6 6 0 0 1 12 0'), line('M9.5 14l3-3.5'), line('M3.5 17h12'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('funnel-crown', 'Premium Funnel', ['premium', 'pro', 'vip', 'funnel', 'funnel'], [body('M3.5 4.5h12l-4.5 6v6l-3 1.5v-7.5Z'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('sitemap-crown', 'Premium Sitemap', ['premium', 'pro', 'vip', 'sitemap', 'sitemap'], [body(R(7, 3, 5, 3.5, 0.8)), body(R(2.5, 13.5, 4.5, 3.5, 0.8)), body(R(12, 13.5, 4.5, 3.5, 0.8)), line('M9.5 6.7V10M4.75 13.3V10h9.5v3.3'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('flowchart-crown', 'Premium Flowchart', ['premium', 'pro', 'vip', 'flowchart', 'flowchart'], [body(R(6, 3, 7, 3.5, 0.8)), body(poly([[9.5, 9], [12, 11], [9.5, 13], [7, 11]], 0.4, true)), body(R(6, 15, 7, 3, 0.8)), line('M9.5 6.7V9M9.5 13.2V15'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('monitor-chart-crown', 'Premium Monitor Chart', ['premium', 'pro', 'vip', 'monitor chart', 'monitor-chart'], [body(R(3, 3.5, 13, 9.5, 1.5)), line('M6 10V8M9 10V6.5M12 10V8.5'), line('M9.5 13.2v3M6.5 16.5h6'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('dashboard-moon', 'Dashboard Night Mode', ['night', 'dark mode', 'sleep', 'dashboard', 'dashboard'], [body(R(3, 4, 5.5, 6, 1)), body(R(10, 4, 5.5, 4, 1)), body(R(3, 11.5, 5.5, 5, 1)), body(R(10, 9.5, 5.5, 7, 1)), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('chart-moon', 'Chart Night Mode', ['night', 'dark mode', 'sleep', 'chart', 'chart'], [body(R(3, 10, 3, 6, 0.8)), body(R(7.5, 7, 3, 9, 0.8)), body(R(12, 4, 3, 12, 0.8)), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('table-moon', 'Table Night Mode', ['night', 'dark mode', 'sleep', 'table', 'table'], [body(R(3, 4.5, 13, 12, 1.5)), line('M3.2 8.5h12.6M3.2 12.5h12.6M8 8.7v7.6'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('pie-chart-moon', 'Pie Chart Night Mode', ['night', 'dark mode', 'sleep', 'pie chart', 'pie-chart'], [body('M9 4.5a6.5 6.5 0 1 0 6.5 6.5H9Z'), line('M11 3a6 6 0 0 1 5 5h-5Z'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('gauge-moon', 'Gauge Night Mode', ['night', 'dark mode', 'sleep', 'gauge', 'gauge'], [line('M3.5 14a6 6 0 0 1 12 0'), line('M9.5 14l3-3.5'), line('M3.5 17h12'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('funnel-moon', 'Funnel Night Mode', ['night', 'dark mode', 'sleep', 'funnel', 'funnel'], [body('M3.5 4.5h12l-4.5 6v6l-3 1.5v-7.5Z'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
  ],
};
