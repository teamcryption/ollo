import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'media',
  icons: [
    icon('fast-forward', 'Fast Forward', ['forward', 'skip', 'speed', 'next'], [body(poly([[4, 7], [11.5, 12], [4, 17]], 1, true)), body(poly([[12, 7], [19.5, 12], [12, 17]], 1, true))], { noAccent: true, mirror: { name: 'rewind', title: 'Rewind', tags: ['rewind', 'back', 'previous', 'reverse'] } }),
    icon('speaker', 'Speaker', ['audio', 'sound', 'hifi', 'music', 'woofer'], [body(R(6, 3, 12, 18, 2.5)), line(C(12, 14.5, 3)), accent(D(12, 7.5))]),
    icon('clapperboard', 'Clapperboard', ['film', 'movie', 'scene', 'video', 'production'], [body(R(3.5, 4.5, 17, 3.5, 1)), line(L(8.5, 4.7, 7, 7.8)), line(L(13.5, 4.7, 12, 7.8)), line(L(18.5, 4.7, 17, 7.8)), body(R(3.5, 10, 17, 10, 2))], { noAccent: true }),
    icon('disc', 'Disc', ['cd', 'vinyl', 'album', 'record', 'music'], [body(C(12, 12, 8.5)), line(C(12, 12, 2.5)), accent(A(12, 12, 5.5, 200, 250))], { anim: 'spin' }),
    icon('equalizer', 'Equalizer', ['mixer', 'audio', 'levels', 'sound', 'eq'], [line(L(6, 4, 6, 20)), line(L(12, 4, 12, 20)), line(L(18, 4, 18, 20)), body(C(6, 15, 2), { cover: true }), body(C(12, 8, 2), { cover: true }), body(C(18, 13, 2), { cover: true })], { noAccent: true }),
    icon('cast', 'Cast', ['screen mirror', 'stream', 'tv', 'chromecast', 'share screen'], [line('M3.5 8V6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 18 20h-4.5'), line('M3.5 12a8 8 0 0 1 8 8'), line('M3.5 16a4 4 0 0 1 4 4'), accent(D(3.8, 19.8))]),
  ],
};
