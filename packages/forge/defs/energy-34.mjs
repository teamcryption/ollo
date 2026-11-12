import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('fuse-box-pause', 'Pause Fuse Box', ['pause', 'hold', 'stop', 'fuse box', 'fuse-box'], [body(R(4, 3, 11, 15, 1.2)), line('M7 6.5v3M9.5 6.5v3M12 6.5v3M7 12v3M9.5 12v3M12 12v3'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('plug-leaf', 'Eco Power Plug', ['eco', 'green', 'sustainable', 'power plug', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('solar-panel-leaf', 'Eco Solar Panel', ['eco', 'green', 'sustainable', 'solar panel', 'solar-panel'], [body(poly([[5, 4], [14, 4], [15.5, 13], [3.5, 13]], 0.8, true)), line('M4.2 8.5h11M9.5 4.2v8.6'), line('M9.5 13.2v4.3M6.5 17.8h6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('wind-turbine-leaf', 'Eco Wind Turbine', ['eco', 'green', 'sustainable', 'wind turbine', 'wind-turbine'], [line('M9.5 9.3v9M7 18.3h5'), line('M9.5 6.8V3M10.6 8.6l3.3 1.9M8.4 8.6l-3.3 1.9'), body(C(9.5, 8, 1.3)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
