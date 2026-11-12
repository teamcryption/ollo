import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'tools',
  icons: [
    icon('wrench-flag', 'Report Wrench', ['report', 'flag', 'mark', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('toolbox-flag', 'Report Toolbox', ['report', 'flag', 'mark', 'toolbox', 'toolbox'], [line('M7 7V5.5h5V7'), body(R(3, 7, 13, 9, 1.5)), line('M3.2 11h12.6'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('brush-flag', 'Report Paint Brush', ['report', 'flag', 'mark', 'paint brush', 'brush'], [line('M15.5 3.5 10 9'), body('M8.8 9.4l1.8 1.8c0 2.6-2 4.6-5.6 4.6.6-1 .4-2.3 1.1-3.8.6-1.3 1.6-2.4 2.7-2.6Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('hammer-flag', 'Report Hammer', ['report', 'flag', 'mark', 'hammer', 'hammer'], [body('M4 5.5h8.5l2 2v2h-3.5V8H4Z'), line('M8.5 8.3v9.5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('bucket-flag', 'Report Bucket', ['report', 'flag', 'mark', 'bucket', 'bucket'], [line('M4.5 8a5 5 0 0 1 10 0'), body('M3.5 8.5h12l-1.4 8.2a1.5 1.5 0 0 1-1.5 1.3H6.4a1.5 1.5 0 0 1-1.5-1.3Z'), line('M4 11.5h11'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('axe-flag', 'Report Axe', ['report', 'flag', 'mark', 'axe', 'axe'], [line('M4.5 18 12.5 4.5'), body('M10.3 5.2 13 3.3c1.8 1.6 2.6 4 2.3 6.6l-3.7-1.4Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('shovel-flag', 'Report Shovel', ['report', 'flag', 'mark', 'shovel', 'shovel'], [line('M9.5 3.5v8M7.5 3.5h4'), body('M6.5 11.5h6v2.5a3 3 0 0 1-6 0Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('ladder-flag', 'Report Ladder', ['report', 'flag', 'mark', 'ladder', 'ladder'], [line('M6 3.5v15M13 3.5v15'), line('M6.2 7h6.6M6.2 11h6.6M6.2 15h6.6'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('flashlight-flag', 'Report Flashlight', ['report', 'flag', 'mark', 'flashlight', 'flashlight'], [body(R(6, 3.5, 7, 3, 1)), body('M6.5 7.6h6l-1 2.4v7.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10Z'), line('M9.5 11.5V13'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('wheelbarrow-flag', 'Report Wheelbarrow', ['report', 'flag', 'mark', 'wheelbarrow', 'wheelbarrow'], [line('M15.5 7.5l1-2'), body(poly([[3.5, 7.5], [15.5, 7.5], [13, 12.5], [6, 12.5]], 0.6, true)), line(C(7, 15.6, 2)), line('M12 12.7v4.5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('hex-nut-flag', 'Report Nut', ['report', 'flag', 'mark', 'nut', 'hex-nut'], [body(poly([[15.8,10.5],[12.65,15.96],[6.35,15.96],[3.2,10.5],[6.35,5.04],[12.65,5.04]], 0.8, true)), line(C(9.5, 10.5, 2.5)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('hook-flag', 'Report Hook', ['report', 'flag', 'mark', 'hook', 'hook'], [line(C(10.5, 4, 1.3)), line('M10.5 5.4V14a3.5 3.5 0 0 1-7 0v-1.5l1.6 1.2'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('hard-hat-flag', 'Report Hard Hat', ['report', 'flag', 'mark', 'hard hat', 'hard-hat'], [body('M4 13.5V12a5.5 5.5 0 0 1 11 0v1.5Z'), line('M9.5 6.5v3.5'), body(R(2.8, 14.2, 13.4, 2.3, 1.15)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('ruler-flag', 'Report Ruler', ['report', 'flag', 'mark', 'ruler', 'ruler'], [body(R(3, 7.5, 13, 6, 1.2)), line('M6 7.7V10M9 7.7v3M12 7.7V10'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('spirit-level-flag', 'Report Spirit Level', ['report', 'flag', 'mark', 'spirit level', 'spirit-level'], [body(R(3, 7.5, 13, 6, 1.5)), line(R(7.5, 9.3, 4, 2.4, 1.2)), line('M5 10.5h1M13 10.5h1'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('pickaxe-flag', 'Report Pickaxe', ['report', 'flag', 'mark', 'pickaxe', 'pickaxe'], [body('M3 8c3.5-4 9.5-4 13 0-4-1.8-9-1.8-13 0Z'), line('M9.5 6.6V18'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('screw-flag', 'Report Screw', ['report', 'flag', 'mark', 'screw', 'screw'], [body(R(5.5, 3.5, 8, 3, 1)), body('M7 7.2h5v6.8l-2.5 4L7 14Z'), line('M7.2 9.3l4.6-1M7.2 11.8l4.6-1'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('nail-flag', 'Report Nail', ['report', 'flag', 'mark', 'nail', 'nail'], [body(R(5.5, 3.5, 8, 2.5, 1)), body('M8 6.5h3v8.5l-1.5 3.5L8 15Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('sickle-flag', 'Report Sickle', ['report', 'flag', 'mark', 'sickle', 'sickle'], [line('M5 18l3-3'), body('M8 15C4.5 11 5 5 10 3.5c3.8-1.2 6.5 1.3 6.5 4.5-1.3-1.8-3.2-2.5-5.2-2-3.5.8-4.8 4.4-2.6 8.2Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('pipe-flag', 'Report Pipe', ['report', 'flag', 'mark', 'pipe', 'pipe'], [line('M3 6.5h6.5a3.5 3.5 0 0 1 3.5 3.5v8.5M3 10h6.5V18.5'), body(R(2.5, 5, 2, 6.5, 0.6)), body(R(8, 16, 6.5, 2.5, 0.6)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('valve-flag', 'Report Valve', ['report', 'flag', 'mark', 'valve', 'valve'], [line('M9.5 3.5v4M6.5 3.5h6'), body('M3 9h3l3.5 2.5L13 9h3v6h-3l-3.5-2.5L6 15H3Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
