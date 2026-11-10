import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('music-lock', 'Locked Track', ['premium song', 'protected audio', 'drm', 'music', 'music'], [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('music-pin', 'Local Music', ['concerts nearby', 'venue', 'local artists', 'music', 'music'], [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('music-bolt', 'Music Boost', ['energy playlist', 'workout music', 'power', 'upbeat', 'music'], [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('music-shield', 'Licensed Music', ['royalty free', 'copyright', 'protected audio', 'music', 'music'], [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
