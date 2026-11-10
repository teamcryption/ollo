import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('camera-pin', 'Photo Location', ['geotag', 'where taken', 'photo map', 'camera', 'camera'], [body('M3 8.5A2.5 2.5 0 0 1 5.5 6h1.3l1.2-2h4l1.2 2h.3A2.5 2.5 0 0 1 16 8.5v6a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 14.5Z'), line(C(9.5, 11.2, 2.6)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('camera-lock', 'Private Photos', ['locked camera', 'secure photos', 'privacy', 'camera', 'camera'], [body('M3 8.5A2.5 2.5 0 0 1 5.5 6h1.3l1.2-2h4l1.2 2h.3A2.5 2.5 0 0 1 16 8.5v6a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 14.5Z'), line(C(9.5, 11.2, 2.6)), body(R(13.8, 15, 7, 6, 1.5), { cover: true }), line('M15.3 15v-1.5a2 2 0 0 1 4 0V15')], { noAccent: true }),
    icon('camera-heart', 'Favourite Shots', ['liked photos', 'best shots', 'photography', 'love', 'camera'], [body('M3 8.5A2.5 2.5 0 0 1 5.5 6h1.3l1.2-2h4l1.2 2h.3A2.5 2.5 0 0 1 16 8.5v6a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 14.5Z'), line(C(9.5, 11.2, 2.6)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('camera-star', 'Featured Photo', ['top shot', 'editors pick', 'photography', 'highlight', 'camera'], [body('M3 8.5A2.5 2.5 0 0 1 5.5 6h1.3l1.2-2h4l1.2 2h.3A2.5 2.5 0 0 1 16 8.5v6a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 14.5Z'), line(C(9.5, 11.2, 2.6)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('camera-shield', 'Camera Privacy', ['camera protection', 'privacy shield', 'secure camera', 'webcam', 'camera'], [body('M3 8.5A2.5 2.5 0 0 1 5.5 6h1.3l1.2-2h4l1.2 2h.3A2.5 2.5 0 0 1 16 8.5v6a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 14.5Z'), line(C(9.5, 11.2, 2.6)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('camera-search', 'Image Search', ['reverse image search', 'visual search', 'find photo', 'camera', 'camera'], [body('M3 8.5A2.5 2.5 0 0 1 5.5 6h1.3l1.2-2h4l1.2 2h.3A2.5 2.5 0 0 1 16 8.5v6a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 14.5Z'), line(C(9.5, 11.2, 2.6)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
