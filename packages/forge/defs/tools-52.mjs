import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'tools',
  icons: [
    icon('wrench-leaf', 'Eco Wrench', ['eco', 'green', 'sustainable', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('toolbox-leaf', 'Eco Toolbox', ['eco', 'green', 'sustainable', 'toolbox', 'toolbox'], [line('M7 7V5.5h5V7'), body(R(3, 7, 13, 9, 1.5)), line('M3.2 11h12.6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('brush-leaf', 'Eco Paint Brush', ['eco', 'green', 'sustainable', 'paint brush', 'brush'], [line('M15.5 3.5 10 9'), body('M8.8 9.4l1.8 1.8c0 2.6-2 4.6-5.6 4.6.6-1 .4-2.3 1.1-3.8.6-1.3 1.6-2.4 2.7-2.6Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('hammer-leaf', 'Eco Hammer', ['eco', 'green', 'sustainable', 'hammer', 'hammer'], [body('M4 5.5h8.5l2 2v2h-3.5V8H4Z'), line('M8.5 8.3v9.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('axe-leaf', 'Eco Axe', ['eco', 'green', 'sustainable', 'axe', 'axe'], [line('M4.5 18 12.5 4.5'), body('M10.3 5.2 13 3.3c1.8 1.6 2.6 4 2.3 6.6l-3.7-1.4Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('shovel-leaf', 'Eco Shovel', ['eco', 'green', 'sustainable', 'shovel', 'shovel'], [line('M9.5 3.5v8M7.5 3.5h4'), body('M6.5 11.5h6v2.5a3 3 0 0 1-6 0Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('ladder-leaf', 'Eco Ladder', ['eco', 'green', 'sustainable', 'ladder', 'ladder'], [line('M6 3.5v15M13 3.5v15'), line('M6.2 7h6.6M6.2 11h6.6M6.2 15h6.6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('flashlight-leaf', 'Eco Flashlight', ['eco', 'green', 'sustainable', 'flashlight', 'flashlight'], [body(R(6, 3.5, 7, 3, 1)), body('M6.5 7.6h6l-1 2.4v7.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10Z'), line('M9.5 11.5V13'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('wheelbarrow-leaf', 'Eco Wheelbarrow', ['eco', 'green', 'sustainable', 'wheelbarrow', 'wheelbarrow'], [line('M15.5 7.5l1-2'), body(poly([[3.5, 7.5], [15.5, 7.5], [13, 12.5], [6, 12.5]], 0.6, true)), line(C(7, 15.6, 2)), line('M12 12.7v4.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('hook-leaf', 'Eco Hook', ['eco', 'green', 'sustainable', 'hook', 'hook'], [line(C(10.5, 4, 1.3)), line('M10.5 5.4V14a3.5 3.5 0 0 1-7 0v-1.5l1.6 1.2'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('pickaxe-leaf', 'Eco Pickaxe', ['eco', 'green', 'sustainable', 'pickaxe', 'pickaxe'], [body('M3 8c3.5-4 9.5-4 13 0-4-1.8-9-1.8-13 0Z'), line('M9.5 6.6V18'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('screw-leaf', 'Eco Screw', ['eco', 'green', 'sustainable', 'screw', 'screw'], [body(R(5.5, 3.5, 8, 3, 1)), body('M7 7.2h5v6.8l-2.5 4L7 14Z'), line('M7.2 9.3l4.6-1M7.2 11.8l4.6-1'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('nail-leaf', 'Eco Nail', ['eco', 'green', 'sustainable', 'nail', 'nail'], [body(R(5.5, 3.5, 8, 2.5, 1)), body('M8 6.5h3v8.5l-1.5 3.5L8 15Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('sickle-leaf', 'Eco Sickle', ['eco', 'green', 'sustainable', 'sickle', 'sickle'], [line('M5 18l3-3'), body('M8 15C4.5 11 5 5 10 3.5c3.8-1.2 6.5 1.3 6.5 4.5-1.3-1.8-3.2-2.5-5.2-2-3.5.8-4.8 4.4-2.6 8.2Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
