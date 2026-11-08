import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L } from '../src/geo.mjs';

export default {
  category: 'media',
  icons: [
    icon('turntable', 'Turntable', ['record player', 'vinyl', 'dj', 'music', 'deck'], [body(R(3, 4.5, 18, 15, 2.5)), line(C(10, 12, 5)), accent(L(17.5, 7, 17.5, 14.5))]),
    icon('boombox', 'Boombox', ['stereo', 'ghetto blaster', 'cassette player', 'music', 'retro'], [line('M7 8V5.5h10V8'), body(R(3, 8, 18, 11, 2.5)), line(C(7.5, 14, 2.5)), line(C(16.5, 14, 2.5)), accent(L(10.5, 10.5, 13.5, 10.5))]),
  ],
};
