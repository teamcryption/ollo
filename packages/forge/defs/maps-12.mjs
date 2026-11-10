import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'maps',
  icons: [
    icon('crossroads', 'Crossroads', ['intersection', 'junction', 'road crossing', 'traffic', 'streets'], [line('M9 3.5V9H3.5M15 3.5V9h5.5M9 20.5V15H3.5M15 20.5V15h5.5'), accent('M12 4v2.5M12 17.5V20M4 12h2.5M17.5 12H20')]),
    icon('geofence', 'Geofence', ['geo fence', 'zone', 'boundary', 'location area', 'perimeter'], [line(E(12, 16, 8.5, 3.5)), body('M12 3.5a4.5 4.5 0 0 1 4.5 4.5c0 3.2-4.5 7.5-4.5 7.5S7.5 11.2 7.5 8A4.5 4.5 0 0 1 12 3.5Z', { cover: true }), line(D(12, 8))], { noAccent: true }),
  ],
};
