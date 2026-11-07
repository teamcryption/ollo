import { R, C, L, A, poly, D, E, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const pine = (cx, top, bottom, w) => poly([[cx, top], [cx + w, bottom], [cx - w, bottom]], 0.6, true);

export default {
  category: 'nature',
  icons: [
    icon('mountain', 'Mountain', ['peak', 'summit', 'hiking', 'alps', 'climb'], [line('M15 12.2 17 9l4 10.5h-2.5'), body(poly([[3, 19.5], [11, 5], [19, 19.5]], 0.8, true)), line(poly([[7.6, 11], [9.3, 12.3], [11, 10.8], [12.7, 12.3], [14.4, 11]], 0.3))], { noAccent: true }),
    icon('volcano', 'Volcano', ['eruption', 'lava', 'mountain', 'magma'], [body(poly([[3, 20], [8.5, 10], [15.5, 10], [21, 20]], 0.8, true)), line(poly([[10, 10.2], [11, 12.5], [12, 11], [13, 12.5], [14, 10.2]], 0.3)), accent('M11 7a1.8 1.8 0 0 1 2.2-2.6A2.2 2.2 0 0 1 17 5')]),
    icon('pine-tree', 'Pine Tree', ['conifer', 'evergreen', 'forest', 'christmas tree', 'fir'], [body(poly([[12, 3], [17.5, 10], [15, 10], [19, 15.5], [5, 15.5], [9, 10], [6.5, 10]], 0.6, true)), line(L(12, 15.7, 12, 20.5))], { noAccent: true, anim: 'wiggle' }),
    icon('seedling', 'Seedling', ['sprout', 'grow', 'plant', 'new', 'eco'], [line(L(12, 20.5, 12, 11)), body('M12 12c-4.5 0-7-2.5-7-7 4.5 0 7 2.5 7 7Z'), body('M12 10.5c0-3.5 2-5.5 5.5-5.5 0 3.5-2 5.5-5.5 5.5Z'), accent(L(15, 20.5, 18.5, 20.5))], { anim: { preset: 'bounce', dist: -1 } }),
    icon('flower', 'Flower', ['daisy', 'bloom', 'spring', 'garden', 'blossom'], [...[0, 60, 120, 180, 240, 300].map((a) => line(rotateD(E(12, 5.2, 1.8, 2.6), a, 12, 9))), body(C(12, 9, 1.6)), line(L(12, 15, 12, 21)), line('M12 18.5c1.5-2 3.5-2.5 5-2.5')], { noAccent: true, anim: 'spin' }),
    icon('acorn', 'Acorn', ['oak', 'nut', 'autumn', 'fall', 'seed'], [line(L(12, 5.5, 12, 3.5)), body('M5 10.5a7 5 0 0 1 14 0Z'), body('M6.5 11.5h11c0 5-2.5 8.5-5.5 9-3-.5-5.5-4-5.5-9Z')], { noAccent: true }),
    icon('feather', 'Feather', ['quill', 'light', 'bird', 'write', 'soft'], [body('M18.5 3.5C11 4 6 9 6 16.5L5 20l3-3c7 0 11-5 10.5-13.5Z'), line(L(4, 20.5, 14.5, 8.5))], { noAccent: true, anim: 'wiggle' }),
    icon('seashell', 'Seashell', ['shell', 'beach', 'scallop', 'ocean', 'sea'], [body('M12 20.5 3.8 10.5a8.2 7 0 0 1 16.4 0Z'), line(L(12, 20, 8, 4.6)), line(L(12, 20, 12, 3.7)), line(L(12, 20, 16, 4.6))], { noAccent: true }),
    icon('forest', 'Forest', ['woods', 'trees', 'nature', 'park', 'outdoors'], [body(pine(8, 5, 15, 4.5)), line(L(8, 15.2, 8, 20.5)), body(pine(15.5, 3.5, 16, 5), { cover: true }), line(L(15.5, 16.2, 15.5, 20.5)), line(L(3, 20.5, 21, 20.5))], { noAccent: true }),
  ],
};
