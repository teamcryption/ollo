import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('balloon-trash', 'Delete Balloon', ['delete', 'remove', 'trash', 'balloon', 'balloon'], [body('M9.5 3.5c3 0 5 2.4 5 5.5 0 3.3-2.4 6-5 6s-5-2.7-5-6c0-3.1 2-5.5 5-5.5Z'), line('M9.5 15c0 1.5-1.5 1.8-1.5 3.5'), line('M7.3 7a2.6 2.6 0 0 1 1.6-1.5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('kite-trash', 'Delete Kite', ['delete', 'remove', 'trash', 'kite', 'kite'], [body(poly([[9.5, 3], [15, 8.5], [9.5, 14], [4, 8.5]], 1, true)), line('M9.5 3.4v10.2M4.4 8.5h10.2'), line('M9.5 14.2c-1.2 1.3.2 2.5-1 4'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('snowman-trash', 'Delete Snowman', ['delete', 'remove', 'trash', 'snowman', 'snowman'], [body(C(9.5, 6, 2.6)), body(C(9.5, 13.6, 4.4)), line(D(9.5, 12) + D(9.5, 15)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('ghost-trash', 'Delete Ghost', ['delete', 'remove', 'trash', 'ghost', 'ghost'], [body('M4.5 9.5a5 5 0 0 1 10 0v8.5l-1.7-1.3-1.6 1.3-1.7-1.3-1.7 1.3-1.6-1.3-1.7 1.3Z'), line(D(7.8, 9.5) + D(11.2, 9.5)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('party-popper-trash', 'Delete Party Popper', ['delete', 'remove', 'trash', 'party popper', 'party-popper'], [body(poly([[3.5, 17.5], [6.5, 8], [13, 14.5]], 0.8, true)), line('M9.5 6.5l1-3M12 8.5l3-1.5M13.8 11.5l2.4.3'), line(D(7.5, 4.5)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('champagne-trash', 'Delete Champagne', ['delete', 'remove', 'trash', 'champagne', 'champagne'], [body('M7.5 3.5h4l-.3 5a1.7 1.7 0 0 1-3.4 0Z'), line(D(9, 6)), line('M9.5 10.4v7M7 17.8h5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('firework-trash', 'Delete Firework', ['delete', 'remove', 'trash', 'firework', 'firework'], [line('M9.5 3.5v3M9.5 12.5v3M3.5 9.5h3M12.5 9.5h3M5.3 5.3l2.1 2.1M11.6 11.6l2.1 2.1M13.7 5.3l-2.1 2.1M5.3 13.7l2.1-2.1'), line(D(9.5, 9.5)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('skull-trash', 'Delete Skull', ['delete', 'remove', 'trash', 'skull', 'skull'], [body('M9.5 3.5a6 6 0 0 1 6 6c0 2-1 3.3-2 4V16a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.5c-1-.7-2-2-2-4a6 6 0 0 1 6-6Z'), line(C(7.2, 9.6, 1.2) + C(11.8, 9.6, 1.2)), line('M8 14.5V16M11 14.5V16'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('gingerbread-trash', 'Delete Gingerbread', ['delete', 'remove', 'trash', 'gingerbread', 'gingerbread'], [body(C(9.5, 5, 2.2)), body('M6.5 8h6l2.5 2-1 1.5-1.5-.8V14l1.5 3.5-1.7.8-2.3-3.3-2.3 3.3-1.7-.8L7 14v-3.3l-1.5.8-1-1.5Z'), line(D(9.5, 10) + D(9.5, 12.2)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('witch-hat-trash', 'Delete Witch Hat', ['delete', 'remove', 'trash', 'witch hat', 'witch-hat'], [body(poly([[5.5, 14.6], [9, 3.5], [13.5, 14.6]], 0.8, true)), line('M6.4 12.3h6.3'), body(R(3, 15.4, 13, 2.3, 1.15)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
  ],
};
