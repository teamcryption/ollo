import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('plug-flag', 'Report Power Plug', ['report', 'flag', 'mark', 'power plug', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('ev-flag', 'Report EV Charger', ['report', 'flag', 'mark', 'ev charger', 'ev'], [body(R(4, 4, 8, 13, 1.5)), line('M12 9h1.5l1.5 2v4'), line('M8.5 7l-1.5 3h2.5L8 13'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('solar-panel-flag', 'Report Solar Panel', ['report', 'flag', 'mark', 'solar panel', 'solar-panel'], [body(poly([[5, 4], [14, 4], [15.5, 13], [3.5, 13]], 0.8, true)), line('M4.2 8.5h11M9.5 4.2v8.6'), line('M9.5 13.2v4.3M6.5 17.8h6'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('wind-turbine-flag', 'Report Wind Turbine', ['report', 'flag', 'mark', 'wind turbine', 'wind-turbine'], [line('M9.5 9.3v9M7 18.3h5'), line('M9.5 6.8V3M10.6 8.6l3.3 1.9M8.4 8.6l-3.3 1.9'), body(C(9.5, 8, 1.3)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('socket-flag', 'Report Power Socket', ['report', 'flag', 'mark', 'power socket', 'socket'], [body(R(3.5, 4.5, 12, 12, 3)), line('M7.5 8.5v2M11.5 8.5v2'), line(D(9.5, 13)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
