import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'notifications',
  icons: [
    icon('bell-bookmark', 'Save Bell', ['save', 'bookmark', 'later', 'bell', 'bell'], [body('M3.5 15h12l-1-1.6V9.5a5 5 0 0 0-10 0v3.9Z'), line('M8 17.5h3M9.5 3.5v.8'), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
    icon('bell-question', 'Bell Help', ['help', 'question', 'support', 'bell', 'bell'], [body('M3.5 15h12l-1-1.6V9.5a5 5 0 0 0-10 0v3.9Z'), line('M8 17.5h3M9.5 3.5v.8'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
  ],
};
