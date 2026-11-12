import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('factory-flag', 'Report Factory', ['report', 'flag', 'mark', 'factory', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('castle-flag', 'Report Castle', ['report', 'flag', 'mark', 'castle', 'castle'], [body(poly([[3.5, 18], [3.5, 5.5], [6, 5.5], [6, 7.5], [8.2, 7.5], [8.2, 5.5], [10.8, 5.5], [10.8, 7.5], [13, 7.5], [13, 5.5], [15.5, 5.5], [15.5, 18]], 0.5, true)), line('M8 17.8V15a1.5 1.5 0 0 1 3 0v2.8'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('street-lamp-flag', 'Report Street Lamp', ['report', 'flag', 'mark', 'street lamp', 'street-lamp'], [line('M6.5 18V6A2.5 2.5 0 0 1 9 3.5h3'), body(poly([[10.5, 4], [14.5, 4], [15.8, 7], [9.2, 7]], 0.5, true)), line('M4.5 18h4'), line('M12.5 9.3v1'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('stairs-flag', 'Report Stairs', ['report', 'flag', 'mark', 'stairs', 'stairs'], [body(poly([[3.5, 18], [3.5, 14], [7, 14], [7, 10.5], [10.5, 10.5], [10.5, 7], [14, 7], [14, 3.5], [16, 3.5], [16, 18]], 0.5, true)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('barn-flag', 'Report Barn', ['report', 'flag', 'mark', 'barn', 'barn'], [body(poly([[3, 9], [5.5, 4.5], [13.5, 4.5], [16, 9], [16, 18], [3, 18]], 0.8, true)), line('M6.5 17.8V12h6v5.8M6.7 12.2l5.6 5.6M12.3 12.2l-5.6 5.6'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('windmill-flag', 'Report Windmill', ['report', 'flag', 'mark', 'windmill', 'windmill'], [line('M5 3.5l9 9M14 3.5l-9 9'), body(poly([[7.6, 10.2], [11.4, 10.2], [13, 18], [6, 18]], 0.6, true)), body(C(9.5, 8, 1.3)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('fire-hydrant-flag', 'Report Fire Hydrant', ['report', 'flag', 'mark', 'fire hydrant', 'fire-hydrant'], [line(D(9.5, 4.3)), body('M6.3 7a3.2 3.2 0 0 1 6.4 0Z'), body(R(5.5, 7.8, 8, 10.2, 1.2)), line('M5.3 11H3.5M13.7 11h1.8'), line('M4 18.6h11'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('office-flag', 'Report Office', ['report', 'flag', 'mark', 'office', 'office'], [body(R(4.5, 3.5, 10, 15, 1)), line('M7.5 7h1M10.5 7h1M7.5 10h1M10.5 10h1M8.5 18.3v-3h2v3'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('brick-flag', 'Report Brick', ['report', 'flag', 'mark', 'brick', 'brick'], [body(R(3, 6, 13, 9, 1)), line('M3.2 10.5h12.6M8 6.2v4.3M11 10.7V15'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('bench-flag', 'Report Bench', ['report', 'flag', 'mark', 'bench', 'bench'], [line('M3 10h13M3 13h13M5 13v4M14 13v4M5 10V7M14 10V7'), line('M3 7h13'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('silo-flag', 'Report Silo', ['report', 'flag', 'mark', 'silo', 'silo'], [body('M5.5 18V8a4 4 0 0 1 8 0v10Z'), line('M5.7 11h7.6M5.7 14.5h7.6'), line('M13.5 18h2.5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
