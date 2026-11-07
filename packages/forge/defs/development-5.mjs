import { C, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

const R0 = 1.8;
const N = [[12, 4.8], [7, 11.8], [17, 11.8], [4.3, 19], [9.7, 19]];
const E = [[0, 1], [0, 2], [1, 3], [1, 4]];
const edge = ([x1, y1], [x2, y2], g = R0 + 1) => {
  const d = Math.hypot(x2 - x1, y2 - y1); const ux = (x2 - x1) / d; const uy = (y2 - y1) / d;
  return L(x1 + ux * g, y1 + uy * g, x2 - ux * g, y2 - uy * g);
};

export default {
  category: 'development',
  icons: [
    icon('binary-tree', 'Binary Tree', ['tree', 'data structure', 'nodes', 'algorithm', 'graph'], [...E.map(([a, b]) => line(edge(N[a], N[b]))), ...N.map(([x, y]) => body(C(x, y, R0)))], { noAccent: true }),
  ],
};
