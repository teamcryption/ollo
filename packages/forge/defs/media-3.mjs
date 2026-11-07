import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'media',
  icons: [
    icon('cassette', 'Cassette', ['tape', 'mixtape', 'retro', 'audio'], [body(R(3, 5.5, 18, 13, 2)), line(C(8.5, 11, 1.8)), line(C(15.5, 11, 1.8)), line(L(10.3, 11, 13.7, 11)), line(poly([[7, 18.5], [8, 15.5], [16, 15.5], [17, 18.5]], 0.4))], { noAccent: true }),
    icon('podcast', 'Podcast', ['show', 'episode', 'listen', 'audio', 'broadcast'], [body(C(12, 11, 2.2)), line(L(12, 13.5, 12, 20.5)), accent(A(12, 11, 4.5, 140, 400)), line(A(12, 11, 7.5, 145, 395))]),
    icon('album', 'Album', ['record', 'cover art', 'music', 'lp', 'collection'], [body(C(14.5, 12, 6.5)), body(R(3, 4, 12, 16, 2), { cover: true }), accent(C(9, 12, 2))]),
    icon('screen-record', 'Screen Record', ['record screen', 'capture', 'screencast', 'recording'], [body(R(3, 4, 18, 12.5, 2.5)), line(L(12, 16.7, 12, 19.5)), line(L(8.5, 20, 15.5, 20)), accent(C(12, 10.25, 2.5))]),
    icon('metronome', 'Metronome', ['tempo', 'bpm', 'rhythm', 'beat', 'music'], [body(poly([[7.5, 20.5], [10, 3.5], [14, 3.5], [16.5, 20.5]], 0.8, true)), line(L(12, 16.5, 16.5, 6.5)), line(L(8.5, 16.5, 15.5, 16.5))], { noAccent: true, anim: 'wiggle' }),
    icon('piano-keys', 'Piano', ['keyboard', 'keys', 'music', 'instrument'], [body(R(3, 5, 18, 14, 2)), line(L(8, 12, 8, 18.8)), line(L(12, 12, 12, 18.8)), line(L(16, 12, 16, 18.8)), body(R(6.6, 5, 2.8, 7, 0.6)), body(R(14.6, 5, 2.8, 7, 0.6))], { noAccent: true }),
  ],
};
