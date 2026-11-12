import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('plug-checkbox', 'Approve Power Plug', ['approve', 'check', 'verified', 'power plug', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('ev-checkbox', 'Approve EV Charger', ['approve', 'check', 'verified', 'ev charger', 'ev'], [body(R(4, 4, 8, 13, 1.5)), line('M12 9h1.5l1.5 2v4'), line('M8.5 7l-1.5 3h2.5L8 13'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('solar-panel-checkbox', 'Approve Solar Panel', ['approve', 'check', 'verified', 'solar panel', 'solar-panel'], [body(poly([[5, 4], [14, 4], [15.5, 13], [3.5, 13]], 0.8, true)), line('M4.2 8.5h11M9.5 4.2v8.6'), line('M9.5 13.2v4.3M6.5 17.8h6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('wind-turbine-checkbox', 'Approve Wind Turbine', ['approve', 'check', 'verified', 'wind turbine', 'wind-turbine'], [line('M9.5 9.3v9M7 18.3h5'), line('M9.5 6.8V3M10.6 8.6l3.3 1.9M8.4 8.6l-3.3 1.9'), body(C(9.5, 8, 1.3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('socket-checkbox', 'Approve Power Socket', ['approve', 'check', 'verified', 'power socket', 'socket'], [body(R(3.5, 4.5, 12, 12, 3)), line('M7.5 8.5v2M11.5 8.5v2'), line(D(9.5, 13)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('fuse-box-checkbox', 'Approve Fuse Box', ['approve', 'check', 'verified', 'fuse box', 'fuse-box'], [body(R(4, 3, 11, 15, 1.2)), line('M7 6.5v3M9.5 6.5v3M12 6.5v3M7 12v3M9.5 12v3M12 12v3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('plug-notice', 'Power Plug Notice', ['notice', 'important', 'attention', 'power plug', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
