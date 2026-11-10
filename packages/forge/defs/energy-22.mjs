import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('solar-panel-chat', 'Solar Panel Chat', ['chat', 'support', 'message', 'solar panel', 'solar-panel'], [body(poly([[5, 4], [14, 4], [15.5, 13], [3.5, 13]], 0.8, true)), line('M4.2 8.5h11M9.5 4.2v8.6'), line('M9.5 13.2v4.3M6.5 17.8h6'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('wind-turbine-chat', 'Wind Turbine Chat', ['chat', 'support', 'message', 'wind turbine', 'wind-turbine'], [line('M9.5 9.3v9M7 18.3h5'), line('M9.5 6.8V3M10.6 8.6l3.3 1.9M8.4 8.6l-3.3 1.9'), body(C(9.5, 8, 1.3)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('solar-panel-download', 'Download Solar Panel', ['download', 'save', 'export', 'solar panel', 'solar-panel'], [body(poly([[5, 4], [14, 4], [15.5, 13], [3.5, 13]], 0.8, true)), line('M4.2 8.5h11M9.5 4.2v8.6'), line('M9.5 13.2v4.3M6.5 17.8h6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('wind-turbine-download', 'Download Wind Turbine', ['download', 'save', 'export', 'wind turbine', 'wind-turbine'], [line('M9.5 9.3v9M7 18.3h5'), line('M9.5 6.8V3M10.6 8.6l3.3 1.9M8.4 8.6l-3.3 1.9'), body(C(9.5, 8, 1.3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
  ],
};
