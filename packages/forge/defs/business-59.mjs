import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('kanban-pricing', 'Kanban Pricing', ['pricing', 'cost', 'money', 'kanban', 'kanban'], [body(R(3, 3.5, 13, 14, 1.5)), line('M7.5 3.7v13.6M11.5 3.7v13.6'), line('M4.8 6.5h1M4.8 9h1M9 6.5h1.2M13 6.5h1M13 9h1M13 11.5h1'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('megaphone-notice', 'Megaphone Notice', ['notice', 'important', 'attention', 'megaphone', 'megaphone'], [body('M3 8.5h3l7.5-4v12L6 12.5H3Z'), line('M5 12.5l1 3.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
