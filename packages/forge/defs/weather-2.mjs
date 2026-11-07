import { R, C, L, A, poly, D, star, scaleD, translateD, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const CLOUD_HI = 'M7 15a3.8 3.8 0 0 1-.5-7.6 5.5 5.5 0 0 1 10.6 1A3.3 3.3 0 0 1 17 15Z';
const CLOUD_LO = 'M9 19.5a3.5 3.5 0 0 1-.4-7 5 5 0 0 1 9.6 1A3 3 0 0 1 18 19.5Z';
const MOON = 'M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z';
const sunrise = (up) => [
  line(L(3, 19, 21, 19)),
  body('M7 19a5 5 0 0 1 10 0Z'),
  line(L(7.05, 14.05, 5.8, 12.8)),
  line(L(16.95, 14.05, 18.2, 12.8)),
  accent(up ? 'M12 10.5V4M9.5 6.5 12 4l2.5 2.5' : 'M12 4v6.5M9.5 8l2.5 2.5L14.5 8'),
];
const flake = [0, 60, 120].flatMap((a) => [line(rotateD(L(12, 3, 12, 21), a))]);
const chevrons = [0, 60, 120, 180, 240, 300].map((a) => line(rotateD(poly([[9.9, 4.6], [12, 6.6], [14.1, 4.6]], 0.3), a)));

export default {
  category: 'weather',
  icons: [
    icon('cloudy', 'Cloudy', ['clouds', 'overcast', 'weather', 'grey', 'forecast'], [line('M8.8 9.3a5 5 0 0 1 9.4 1.9 2.7 2.7 0 0 1 .4 5.3'), body('M6.5 20a3.6 3.6 0 0 1-.5-7.2 5.2 5.2 0 0 1 10 1A3.1 3.1 0 0 1 15.7 20Z', { cover: true })], { noAccent: true, anim: { preset: 'nudge', dir: [1, 0], dist: 1 } }),
    icon('cloud-moon', 'Cloudy Night', ['night', 'cloudy', 'moon', 'forecast', 'evening'], [body(translateD(scaleD(MOON, 0.5), -3, -3.5)), accent(D(16, 5.5)), body(CLOUD_LO, { cover: true })], { anim: { preset: 'bounce', dist: -1.5 } }),
    icon('fog', 'Fog', ['mist', 'haze', 'smog', 'weather', 'visibility'], [line('M7 11.5a5 5 0 0 1 10 0'), line(L(3.5, 11.5, 20.5, 11.5)), line(L(3.5, 15, 15, 15)), accent(L(18, 15, 20.5, 15)), line(L(6, 18.5, 20.5, 18.5))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1 } }),
    icon('hail', 'Hail', ['hailstorm', 'ice', 'weather', 'storm', 'pellets'], [body(CLOUD_HI), line(C(7.5, 18.6, 1.3)), line(C(11.3, 19.6, 1.3)), accent(C(16, 18.6, 1.3))], { anim: { preset: 'bounce', dist: 1.5 } }),
    icon('rain-heavy', 'Heavy Rain', ['downpour', 'shower', 'monsoon', 'weather', 'flood'], [body(CLOUD_HI), line(L(7.5, 17.5, 6.5, 20.5)), line(L(10.5, 17.5, 9.5, 20.5)), accent(L(13.5, 17.5, 12.5, 20.5)), line(L(16.5, 17.5, 15.5, 20.5))], { anim: { preset: 'bounce', dist: 1.5 } }),
    icon('tornado', 'Tornado', ['twister', 'cyclone', 'storm', 'hurricane', 'wind'], [line(L(3.5, 5, 20.5, 5)), line(L(5.5, 9, 18.5, 9)), line(L(8, 13, 17, 13)), accent(L(9.5, 17, 14.5, 17)), line(L(11, 20.5, 12.5, 20.5))], { anim: 'wiggle' }),
    icon('sunrise', 'Sunrise', ['dawn', 'morning', 'sun up', 'daybreak'], sunrise(true), { anim: { preset: 'bounce', dist: -1.5 }, variants: [{ name: 'sunset', title: 'Sunset', tags: ['dusk', 'evening', 'sun down', 'twilight'], els: sunrise(false) }] }),
    icon('snowflake', 'Snowflake', ['winter', 'cold', 'frozen', 'ice', 'freeze'], [...flake, ...chevrons], { noAccent: true, anim: 'spin' }),
    icon('windsock', 'Windsock', ['wind direction', 'airport', 'breeze', 'gust'], [line(L(5, 3.5, 5, 20.5)), body('M5 5.5l14 1.8v4.4L5 13.5Z'), line(L(9.8, 6.2, 9.8, 12.8)), line(L(14.5, 6.8, 14.5, 12.2)), accent(L(16.5, 15.5, 20, 15.5))], { anim: 'wiggle' }),
    icon('moon-stars', 'Clear Night', ['night', 'stars', 'sleep', 'dark', 'sky'], [body(scaleD(MOON, 0.85, 10, 14)), accent(star(17.5, 6, 2.6, 0.9, 4, 0.2)), line(D(20, 11))], { anim: 'wiggle' }),
    icon('celsius', 'Celsius', ['temperature', 'degrees', 'metric', 'weather'], [line(C(6.5, 6.5, 2)), line(A(15.5, 12, 5.5, 40, 320))], { noAccent: true }),
    icon('fahrenheit', 'Fahrenheit', ['temperature', 'degrees', 'imperial', 'weather'], [line(C(6.5, 6.5, 2)), line(poly([[19, 5.5], [12.5, 5.5], [12.5, 19]], 0.6)), line(L(12.5, 12, 17.5, 12))], { noAccent: true }),
  ],
};
