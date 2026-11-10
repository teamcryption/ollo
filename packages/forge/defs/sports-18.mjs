import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD } from '../src/geo.mjs';

const spokes = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return `M${(12 + 2 * c).toFixed(2)} ${(12 + 2 * s).toFixed(2)}L${(12 + 8.5 * c).toFixed(2)} ${(12 + 8.5 * s).toFixed(2)}`; }).join('');

export default {
  category: 'sports',
  icons: [
    icon('curling-stone', 'Curling Stone', ['curling', 'winter sport', 'ice', 'stone', 'olympics'], [line('M8.5 11V8.5A1.5 1.5 0 0 1 10 7h7'), body(R(4, 11, 16, 8.5, 4)), line('M4.2 15h15.6')], { noAccent: true }),
    icon('bowling-pin', 'Bowling Pin', ['skittle', 'bowling', 'strike', 'alley', 'game'], [body('M12 3a2 2 0 0 1 2 2c0 1.5-.8 2.5-.8 3.8 0 1.5 2.8 3.5 2.8 7.2 0 2.5-1 4.5-1.5 4.5h-5c-.5 0-1.5-2-1.5-4.5 0-3.7 2.8-5.7 2.8-7.2C10.8 7.5 10 6.5 10 5a2 2 0 0 1 2-2Z'), line('M10.6 9.3h2.8')], { noAccent: true }),
    icon('life-ring', 'Life Ring', ['lifebuoy', 'rescue', 'safety', 'pool', 'lifeguard'], [body(C(12, 12, 8.5)), line(C(12, 12, 4)), line('M12 3.5V8M12 16v4.5M3.5 12H8M16 12h4.5')], { noAccent: true }),
    icon('ship-wheel', 'Ship Wheel', ['helm', 'steering', 'nautical', 'captain', 'sailing'], [line(spokes), line(C(12, 12, 5.5)), body(C(12, 12, 2))], { noAccent: true, anim: 'wiggle' }),
    icon('hammock', 'Hammock', ['relax', 'rest', 'vacation', 'garden', 'swing'], [line('M3.5 20.5V6.5M20.5 20.5V6.5M3.5 9l1.5.5M20.5 9 19 9.5'), body('M5 9.5c2.5 4 11.5 4 14 0-1 4.5-4 7-7 7s-6-2.5-7-7Z')], { noAccent: true }),
    icon('skis', 'Skis', ['skiing', 'slope', 'winter', 'snow', 'alpine'], [line('M3.5 19 13.5 4.6c.6-.9 1.8-1.1 2.5-.5M8 20.5 18 6.1c.6-.9 1.8-1.1 2.5-.5'), line('M6.5 15.5l5 2.5')], { noAccent: true }),
    icon('buoy', 'Buoy', ['marker', 'nautical', 'harbor', 'channel', 'sea'], [body(C(12, 4.8, 1.5)), line('M12 6.3V8'), body(poly([[9, 8], [15, 8], [17, 16.5], [7, 16.5]], 0.8, true)), line('M8.3 12.3h7.4'), accent('M3.5 20c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4 .3')], { anim: 'wiggle' }),
  ],
};
