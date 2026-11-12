import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('bug-pricing', 'Bug Pricing', ['pricing', 'cost', 'money', 'bug', 'bug'], [body(E(9.5, 11, 3.5, 4.5)), line('M6 8 4 6.5M13 8l2-1.5M6 11H3.5M13 11h2.5M6.5 14l-2 1.5M12.5 14l2 1.5M9.5 6.5V15.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('server-pricing', 'Server Pricing', ['pricing', 'cost', 'money', 'server', 'server'], [body(R(3.5, 4, 12, 5.5, 1.5)), body(R(3.5, 11.5, 12, 5.5, 1.5)), line(D(6.5, 6.8) + D(6.5, 14.3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('database-pricing', 'Database Pricing', ['pricing', 'cost', 'money', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
  ],
};
