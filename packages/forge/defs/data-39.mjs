import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'data',
  icons: [
    icon('chart-pricing', 'Chart Pricing', ['pricing', 'cost', 'money', 'chart', 'chart'], [body(R(3, 10, 3, 6, 0.8)), body(R(7.5, 7, 3, 9, 0.8)), body(R(12, 4, 3, 12, 0.8)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('pie-chart-pricing', 'Pie Chart Pricing', ['pricing', 'cost', 'money', 'pie chart', 'pie-chart'], [body('M9 4.5a6.5 6.5 0 1 0 6.5 6.5H9Z'), line('M11 3a6 6 0 0 1 5 5h-5Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('funnel-pricing', 'Funnel Pricing', ['pricing', 'cost', 'money', 'funnel', 'funnel'], [body('M3.5 4.5h12l-4.5 6v6l-3 1.5v-7.5Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
  ],
};
