import { E, D, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

const spikes = [];
for (let i = 0; i <= 10; i++) {
  const a = ((180 - i * 13.5) * Math.PI) / 180;
  const o = i % 2 === 0 ? 1 : 0.8;
  spikes.push([11.2 + 8 * o * Math.cos(a), 17.5 - 10 * o * Math.sin(a)]);
}
const HEDGEHOG = poly([...spikes, [20.5, 15.5], [17, 17.5]], 0.5, true);

export default {
  category: 'animals',
  icons: [
    icon('sheep', 'Sheep', ['lamb', 'wool', 'farm', 'fluffy', 'animal'], [line('M9.5 15.5v4M12.5 15.5v4M15.5 15.5v4M18 15.5v4'), body('M8.5 15.5a2.2 2.2 0 0 1-1.2-4 2.5 2.5 0 0 1 2.4-4 2.8 2.8 0 0 1 4.8-.8 2.8 2.8 0 0 1 4.6 1.6 2.4 2.4 0 0 1 .8 4.4 2.3 2.3 0 0 1-2.4 2.8Z'), body(E(5.6, 10.8, 2.3, 3), { cover: true }), line(D(5.3, 10.3))], { noAccent: true }),
    icon('hedgehog', 'Hedgehog', ['spiky', 'woodland', 'garden', 'prickly', 'animal'], [line('M7 17.5v2.5M14 17.5v2.5'), body(HEDGEHOG), line(D(16.5, 14.2))], { noAccent: true }),
    icon('horseshoe', 'Horseshoe', ['horse', 'luck', 'lucky', 'farrier', 'stable'], [body('M5.5 20V11a6.5 6.5 0 0 1 13 0v9h-3.5v-9a3 3 0 0 0-6 0v9Z'), line(D(7.25, 17.5) + D(7.25, 14) + D(16.75, 17.5) + D(16.75, 14))], { noAccent: true }),
  ],
};
