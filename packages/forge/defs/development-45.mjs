import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('server-rack-trash', 'Delete Server Rack', ['delete', 'remove', 'trash', 'server rack', 'server-rack'], [body(R(4.5, 3, 10, 15.5, 1.5)), line('M4.7 7.5h9.6M4.7 11.5h9.6M4.7 15h9.6'), line(D(7, 5.3) + D(7, 9.5) + D(7, 13.3)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('circuit-trash', 'Delete Circuit', ['delete', 'remove', 'trash', 'circuit', 'circuit'], [line('M3 6h5l2 2v4l2 2h4M3 15h4M10 3v3M16 6h-3'), line(C(7.5, 15, 0.01)), body(C(8.5, 15, 1.3)), body(C(12, 6, 1.3)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('git-merge-trash', 'Delete Merge', ['delete', 'remove', 'trash', 'merge', 'git-merge'], [line(C(5.5, 4.5, 1.6) + C(5.5, 16.5, 1.6) + C(13.5, 10.5, 1.6)), line('M5.5 6.2v8.6M5.5 6.5c0 3 3 4 6.4 4'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('pull-request-trash', 'Delete Pull Request', ['delete', 'remove', 'trash', 'pull request', 'pull-request'], [line(C(5, 4.5, 1.6) + C(5, 16.5, 1.6) + C(14, 16.5, 1.6)), line('M5 6.2v8.6M14 14.8V8a2.5 2.5 0 0 0-2.5-2.5H8.5M10 3.8 8.3 5.5 10 7.2'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('api-trash', 'Delete API', ['delete', 'remove', 'trash', 'api', 'api'], [body(R(3, 5, 13, 11, 2)), line('M6.5 12.5l1.3-4 1.3 4M7 11.3h1.6M10.5 12.5v-4h1a1.2 1.2 0 0 1 0 2.4h-1M14 8.5v4'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('variable-trash', 'Delete Variable', ['delete', 'remove', 'trash', 'variable', 'variable'], [line('M6 4c-2 2-2 11 0 13M13 4c2 2 2 11 0 13'), line('M7.5 8l4 5M11.5 8l-4 5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('laptop-code-trash', 'Delete Laptop Code', ['delete', 'remove', 'trash', 'laptop code', 'laptop-code'], [body(R(4, 4.5, 11, 8, 1.5)), line('M2.5 15h14'), line('M8 7l-1.5 1.5L8 10M11 7l1.5 1.5L11 10'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('server-rack-flag', 'Report Server Rack', ['report', 'flag', 'mark', 'server rack', 'server-rack'], [body(R(4.5, 3, 10, 15.5, 1.5)), line('M4.7 7.5h9.6M4.7 11.5h9.6M4.7 15h9.6'), line(D(7, 5.3) + D(7, 9.5) + D(7, 13.3)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('circuit-flag', 'Report Circuit', ['report', 'flag', 'mark', 'circuit', 'circuit'], [line('M3 6h5l2 2v4l2 2h4M3 15h4M10 3v3M16 6h-3'), line(C(7.5, 15, 0.01)), body(C(8.5, 15, 1.3)), body(C(12, 6, 1.3)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('git-merge-flag', 'Report Merge', ['report', 'flag', 'mark', 'merge', 'git-merge'], [line(C(5.5, 4.5, 1.6) + C(5.5, 16.5, 1.6) + C(13.5, 10.5, 1.6)), line('M5.5 6.2v8.6M5.5 6.5c0 3 3 4 6.4 4'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('pull-request-flag', 'Report Pull Request', ['report', 'flag', 'mark', 'pull request', 'pull-request'], [line(C(5, 4.5, 1.6) + C(5, 16.5, 1.6) + C(14, 16.5, 1.6)), line('M5 6.2v8.6M14 14.8V8a2.5 2.5 0 0 0-2.5-2.5H8.5M10 3.8 8.3 5.5 10 7.2'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('api-flag', 'Report API', ['report', 'flag', 'mark', 'api', 'api'], [body(R(3, 5, 13, 11, 2)), line('M6.5 12.5l1.3-4 1.3 4M7 11.3h1.6M10.5 12.5v-4h1a1.2 1.2 0 0 1 0 2.4h-1M14 8.5v4'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('variable-flag', 'Report Variable', ['report', 'flag', 'mark', 'variable', 'variable'], [line('M6 4c-2 2-2 11 0 13M13 4c2 2 2 11 0 13'), line('M7.5 8l4 5M11.5 8l-4 5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('laptop-code-flag', 'Report Laptop Code', ['report', 'flag', 'mark', 'laptop code', 'laptop-code'], [body(R(4, 4.5, 11, 8, 1.5)), line('M2.5 15h14'), line('M8 7l-1.5 1.5L8 10M11 7l1.5 1.5L11 10'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
