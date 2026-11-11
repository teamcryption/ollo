import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('headphones-trash', 'Delete Headphones', ['delete', 'remove', 'trash', 'headphones', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('tv-trash', 'Delete TV', ['delete', 'remove', 'trash', 'tv', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('mic-trash', 'Delete Mic', ['delete', 'remove', 'trash', 'mic', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('film-trash', 'Delete Film', ['delete', 'remove', 'trash', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('camera-trash', 'Delete Camera', ['delete', 'remove', 'trash', 'camera', 'camera'], [body(R(3, 6.5, 13, 10, 2)), line('M7 6.5 8 4.5h3l1 2'), line(C(9.5, 11.5, 2.5)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('music-trash', 'Delete Music', ['delete', 'remove', 'trash', 'music', 'music'], [line('M8 15.5V5.5l7-2v9.5'), body(C(6, 15.5, 2)), body(C(13, 13, 2)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('guitar-trash', 'Delete Guitar', ['delete', 'remove', 'trash', 'guitar', 'guitar'], [line('M10.5 8.5 15.5 3.5'), body('M8.7 7.3a2.6 2.6 0 0 1 3.7 3.7c-.6.6-1 1.1-.9 2a3.6 3.6 0 1 1-4.8-4.8c.9.1 1.4-.3 2-.9Z'), line(D(7.6, 13)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('drum-trash', 'Delete Drum', ['delete', 'remove', 'trash', 'drum', 'drum'], [body('M3.5 8.5v6c0 1.7 2.7 3 6 3s6-1.3 6-3v-6'), line(E(9.5, 8.5, 6, 2.5)), line('M3 3.5l5 4M16 3.5l-5 4'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('radio-trash', 'Delete Radio', ['delete', 'remove', 'trash', 'radio', 'radio'], [line('M5 7 12.5 3.5'), body(R(3, 7, 13, 10, 2)), line(C(7.5, 12, 2.2)), line('M12 10h1.5M12 12.5h1.5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('cassette-trash', 'Delete Cassette', ['delete', 'remove', 'trash', 'cassette', 'cassette'], [body(R(3, 5.5, 13, 10, 1.5)), line(C(7, 9.5, 1.3) + C(12, 9.5, 1.3)), line('M6 15.3l1-2.3h5l1 2.3'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('metronome-trash', 'Delete Metronome', ['delete', 'remove', 'trash', 'metronome', 'metronome'], [body(poly([[7, 3.5], [12, 3.5], [15, 18], [4, 18]], 0.8, true)), line('M5.3 14.5h8.4'), line('M9.5 14.3l2.8-7.8'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('piano-trash', 'Delete Piano', ['delete', 'remove', 'trash', 'piano', 'piano'], [body(R(3, 4, 13, 12, 1.5)), line('M3.2 9h12.6'), line('M6.5 9.2v6.6M9.5 9.2v6.6M12.5 9.2v6.6'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('boombox-trash', 'Delete Boombox', ['delete', 'remove', 'trash', 'boombox', 'boombox'], [line('M6 6V4h7v2'), body(R(3, 6, 13, 10, 2)), line(C(6.8, 11, 2) + C(12.2, 11, 2)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('polaroid-trash', 'Delete Instant Photo', ['delete', 'remove', 'trash', 'instant photo', 'polaroid'], [body(R(4, 3.5, 11, 14, 1.5)), line(R(5.8, 5.3, 7.4, 7.4, 0.6)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('image-trash', 'Delete Image', ['delete', 'remove', 'trash', 'image', 'image'], [body(R(3, 4.5, 13, 12, 2)), line('M3.5 14l3.5-3.5 3 3 2-2 3.5 3.5'), line(C(12, 8, 1.2)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('soundwave-trash', 'Delete Audio', ['delete', 'remove', 'trash', 'audio', 'soundwave'], [line('M3.5 10v1M6 7.5v6M8.5 5v11M11 7.5v6M13.5 9v3M16 10v1'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
  ],
};
