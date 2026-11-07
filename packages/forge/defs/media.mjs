import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const SPEAKER = 'M4 10a1.5 1.5 0 0 1 1.5-1.5H8l4.5-3.8v14.6L8 15.5H5.5A1.5 1.5 0 0 1 4 14Z';

export default {
  category: 'media',
  icons: [
    icon('play', 'Play', ['start', 'video', 'audio', 'resume', 'media'], [body(poly([[8, 5], [19, 12], [8, 19]], 2.2, true))], { noAccent: true, anim: 'pulse' }),
    icon('pause', 'Pause', ['hold', 'stop', 'break', 'media'], [body(R(6.5, 5, 4, 14, 1.5)), body(R(13.5, 5, 4, 14, 1.5))], { noAccent: true, anim: 'pulse' }),
    icon('stop', 'Stop', ['end', 'halt', 'square', 'media'], [body(R(5.5, 5.5, 13, 13, 3))], { noAccent: true, anim: 'pulse' }),
    icon('record', 'Record', ['rec', 'live', 'capture', 'dot', 'media'], [line(C(12, 12, 8.5)), body(C(12, 12, 4.5))], { noAccent: true, anim: 'pulse' }),
    icon('skip-forward', 'Skip Forward', ['next', 'track', 'forward', 'media'], [body(poly([[5, 6], [14.5, 12], [5, 18]], 1.8, true)), accent(L(18.5, 6, 18.5, 18))], { mirror: { name: 'skip-back', title: 'Skip Back', tags: ['previous', 'track', 'back', 'media'] }, anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('play-circle', 'Play Circle', ['start', 'video', 'watch', 'media'], [body(C(12, 12, 8.5)), accent(poly([[10.2, 8.8], [15.2, 12], [10.2, 15.2]], 1, true))], { anim: 'pulse' }),
    icon('image', 'Image', ['picture', 'photo', 'gallery', 'landscape', 'jpg'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(poly([[6.5, 16.5], [10, 12.8], [12.5, 15.3], [14.5, 13.3], [17.5, 16.5]], 0.8)), accent(C(15.5, 8.8, 1.4))], { badges: ['add', 'remove', 'check', 'close'] }),
    icon('images', 'Images', ['gallery', 'photos', 'album', 'collection'], [body(R(7.5, 3.5, 13, 11.5, 2.5)), body(R(3.5, 8, 13, 12, 2.5), { cover: true }), line(poly([[6.2, 17.5], [8.8, 14.6], [10.6, 16.4], [11.8, 15.2], [13.8, 17.5]], 0.6)), accent(C(12.4, 11.4, 1))]),
    icon('camera', 'Camera', ['photo', 'picture', 'shoot', 'snapshot', 'lens'], [body('M3.5 9A2.5 2.5 0 0 1 6 6.5h1.8l1.4-2h5.6l1.4 2H18A2.5 2.5 0 0 1 20.5 9v8.5A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z'), line(C(12, 13, 3.5)), accent(D(17.2, 9.6))], { badges: ['add', 'close'] }),
    icon('film', 'Film', ['movie', 'cinema', 'video', 'reel', 'clip'], [body(R(4, 3.5, 16, 17, 2.5)), line(L(8, 3.7, 8, 20.3)), line(L(16, 3.7, 16, 20.3)), accent(L(10.5, 12, 13.5, 12))]),
    icon('music', 'Music', ['note', 'song', 'audio', 'melody', 'sound'], [body(C(7.5, 17, 2.5)), body(C(16.5, 15, 2.5)), line('M10 17V6.6l9-2.1V15'), accent(L(12.5, 8.5, 16.5, 7.6))], { anim: { preset: 'bounce', dist: -2 } }),
    icon('headphones', 'Headphones', ['audio', 'music', 'listen', 'headset', 'podcast'], [line('M4.5 15v-3a7.5 7.5 0 0 1 15 0v3'), body(R(3.5, 14, 4, 6, 1.8)), body(R(16.5, 14, 4, 6, 1.8)), accent(A(12, 12, 4.8, -135, -105))], { anim: 'wiggle' }),
    icon('volume', 'Volume', ['sound', 'audio', 'speaker', 'loud'], [body(SPEAKER), accent(A(13.5, 12, 3.5, -45, 45)), line(A(13.5, 12, 6.5, -50, 50))], { anim: 'pulse' }),
    icon('volume-low', 'Volume Low', ['sound', 'quiet', 'speaker', 'soft'], [body(SPEAKER), accent(A(13.5, 12, 3.5, -45, 45))], { anim: 'pulse' }),
    icon('volume-off', 'Volume Off', ['mute', 'silent', 'speaker', 'no sound'], [body(SPEAKER), line(L(16, 10, 20, 14)), line(L(20, 10, 16, 14))], { anim: 'wiggle', noAccent: true }),
    icon('playlist', 'Playlist', ['queue', 'list', 'tracks', 'songs', 'music'], [line(L(4, 6.5, 16, 6.5)), line(L(4, 11, 16, 11)), accent(L(4, 15.5, 10, 15.5)), body(poly([[14, 14], [19.5, 17], [14, 20]], 1, true))]),
    icon('radio', 'Radio', ['fm', 'broadcast', 'tuner', 'station', 'audio'], [line(L(7, 7.5, 16.5, 3.8)), body(R(3.5, 7.5, 17, 12.5, 2.5)), line(C(15.5, 13.8, 2.6)), accent(L(6.8, 12, 10.2, 12)), line(L(6.8, 15.5, 10.2, 15.5))]),
    icon('mic-studio', 'Studio Mic', ['podcast', 'record', 'vocal', 'microphone', 'broadcast'], [body(R(8.5, 3, 7, 10, 3.5)), line(L(8.7, 7.5, 10.5, 7.5)), line(L(13.5, 7.5, 15.3, 7.5)), line('M6 11a6 6 0 0 0 12 0'), line(L(12, 17, 12, 20.5)), line(L(9, 20.5, 15, 20.5))], { noAccent: true }),
  ],
};
