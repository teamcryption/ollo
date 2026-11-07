import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const rays = (cx, cy, r0, r1, n = 8, skip = []) => {
  const out = [];
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue;
    const a = (i * 2 * Math.PI) / n - Math.PI / 2;
    out.push(L(cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)));
  }
  return out;
};
// Cloud that sits a little higher so rain/snow fits underneath.
const CLOUD_HI = 'M7 15a3.8 3.8 0 0 1-.5-7.6 5.5 5.5 0 0 1 10.6 1A3.3 3.3 0 0 1 17 15Z';

export default {
  category: 'weather',
  icons: [
    icon('sun', 'Sun', ['sunny', 'day', 'bright', 'clear', 'light mode'], [body(C(12, 12, 4)), ...rays(12, 12, 6.8, 8.8).map((d, i) => (i === 1 ? accent(d) : line(d)))], { anim: 'spin' }),
    icon('moon', 'Moon', ['night', 'dark mode', 'sleep', 'crescent'], [body('M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z'), accent(D(16.5, 6))], { anim: 'wiggle' }),
    icon('cloud-sun', 'Partly Cloudy', ['weather', 'cloudy', 'sun', 'forecast', 'mild'], [body(C(9, 9, 3.2)), ...rays(9, 9, 5.3, 6.5, 8, [3, 4, 5]).map((d, i) => (i === 0 ? accent(d) : line(d))), body('M9 19.5a3.5 3.5 0 0 1-.4-7 5 5 0 0 1 9.6 1A3 3 0 0 1 18 19.5Z', { cover: true })], { anim: { preset: 'bounce', dist: -1.5 } }),
    icon('rain', 'Rain', ['rainy', 'weather', 'shower', 'drizzle', 'wet'], [body(CLOUD_HI), line(L(8.5, 17.5, 7.8, 19.8)), accent(L(12.3, 17.5, 11.6, 19.8)), line(L(16.1, 17.5, 15.4, 19.8))], { anim: { preset: 'bounce', dist: 1.5 } }),
    icon('snow', 'Snow', ['snowy', 'winter', 'cold', 'weather', 'flake'], [body(CLOUD_HI), line(D(8.5, 18.5)), accent(D(12, 20)), line(D(15.5, 18.5))], { anim: { preset: 'bounce', dist: 1.5 } }),
    icon('storm', 'Storm', ['thunder', 'lightning', 'weather', 'thunderstorm'], [body(CLOUD_HI), accent(poly([[12.8, 17], [11.2, 19.2], [13.2, 19.2], [12, 21]], 0.4))], { anim: 'wiggle' }),
    icon('lightning', 'Lightning', ['bolt', 'flash', 'energy', 'power', 'electric'], [body(poly([[13.5, 3], [5.5, 13.5], [11.5, 13.5], [10.5, 21], [18.5, 10.5], [12.5, 10.5]], 1, true))], { noAccent: true, anim: 'pulse' }),
    icon('wind', 'Wind', ['breeze', 'air', 'weather', 'gust', 'windy'], [line('M3.5 9h10a2.5 2.5 0 1 0-2.5-2.5'), line('M3.5 13h14a2.5 2.5 0 1 1-2.5 2.5'), accent(L(3.5, 17, 9, 17))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('umbrella', 'Umbrella', ['rain', 'protection', 'insurance', 'weather', 'cover'], [body('M3.5 12a8.5 8.5 0 0 1 17 0Z'), line('M12 12v6a2 2 0 0 1-4 0'), accent(A(12, 12, 5.5, -150, -115))], { anim: 'wiggle' }),
    icon('thermometer', 'Thermometer', ['temperature', 'heat', 'weather', 'degrees', 'climate'], [body('M10 5.5a2 2 0 0 1 4 0v8.1a4 4 0 1 1-4 0Z'), accent(L(12, 9, 12, 16.5)), line(L(16.5, 6.5, 18, 6.5)), line(L(16.5, 9.5, 18, 9.5))], { anim: { preset: 'bounce', dist: -1 } }),
    icon('droplet', 'Droplet', ['water', 'humidity', 'liquid', 'rain', 'drop'], [body('M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5Z'), accent(A(12, 14, 3.2, 100, 160))], { anim: { preset: 'bounce', dist: 1.5 } }),
    icon('rainbow', 'Rainbow', ['weather', 'colour', 'pride', 'arc', 'spectrum'], [line(A(12, 18, 9, 180, 360)), line(A(12, 18, 6, 180, 360)), accent(A(12, 18, 3, 180, 360))], { anim: 'pop-draw' }),
  ],
};
