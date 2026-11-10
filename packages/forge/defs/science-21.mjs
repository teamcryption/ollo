import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('dna-search', 'Genetic Test', ['dna testing', 'ancestry', 'genome', 'science', 'dna'], [line('M6 3.5c0 4 7 4 7 8s-7 4-7 8M13 3.5c0 4-7 4-7 8s7 4 7 8M7.5 6.5h4M7.5 16.5h4'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('dna-lock', 'Genetic Privacy', ['protected dna data', 'private genome', 'security', 'science', 'dna'], [line('M6 3.5c0 4 7 4 7 8s-7 4-7 8M13 3.5c0 4-7 4-7 8s7 4 7 8M7.5 6.5h4M7.5 16.5h4'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
  ],
};
