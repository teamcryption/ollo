import { R, C, L, A, poly, D, E, rotateD, scaleD, translateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const PLANE = 'M12 3c.8 0 1.5 1 1.5 2.5V9l6.5 4v2l-6.5-2v4l2 1.5V20l-3.5-1-3.5 1v-1.5l2-1.5v-4L4 15v-2l6.5-4V5.5C10.5 4 11.2 3 12 3Z';
const plane = (deg) => translateD(rotateD(scaleD(PLANE, 0.72), deg), 0, -2);

export default {
  category: 'travel',
  icons: [
    icon('airplane-takeoff', 'Takeoff', ['departure', 'departing', 'flight', 'airport'], [body(plane(60)), accent(L(3.5, 20.5, 20.5, 20.5))], { anim: { preset: 'nudge', dir: [1, -1], dist: 1.5 } }),
    icon('airplane-landing', 'Landing', ['arrival', 'arriving', 'flight', 'airport'], [body(plane(120)), accent(L(3.5, 20.5, 20.5, 20.5))], { anim: { preset: 'nudge', dir: [1, 1], dist: 1.5 } }),
    icon('luggage', 'Luggage', ['trolley bag', 'rolling suitcase', 'baggage', 'carry-on'], [line('M10 6V3.5h4V6'), body(R(7, 6, 10, 13, 2)), line(D(9.5, 21)), line(D(14.5, 21)), accent(L(12, 9.5, 12, 15.5))]),
    icon('beach-umbrella', 'Beach Umbrella', ['parasol', 'beach', 'summer', 'holiday', 'shade'], [body(rotateD('M4 11.5a8 8 0 0 1 16 0Z', -20, 12, 11.5)), line(L(12, 11.5, 15.1, 20)), accent(L(3.5, 20.5, 10, 20.5))]),
    icon('concierge-bell', 'Reception Bell', ['hotel', 'service', 'reception', 'front desk', 'ring'], [line(L(10.5, 6.5, 13.5, 6.5)), line(L(12, 6.5, 12, 9.5)), body('M4.5 17a7.5 7.5 0 0 1 15 0Z'), line(L(3, 19.5, 21, 19.5)), accent(A(12, 17, 4.5, 215, 260))], { anim: 'wiggle' }),
    icon('key-card', 'Key Card', ['room key', 'hotel', 'access card', 'check-in'], [body(R(6, 3, 12, 18, 2.5)), accent(L(9.5, 7.5, 14.5, 7.5)), line(C(12, 15, 2.2))]),
    icon('hot-air-balloon', 'Hot Air Balloon', ['balloon', 'adventure', 'sky', 'festival', 'flight'], [body('M12 3a7 7 0 0 1 7 7c0 3.5-3.5 6-5 7.5h-4C8.5 16 5 13.5 5 10a7 7 0 0 1 7-7Z'), line(E(12, 10, 2.6, 7)), line(L(10, 17.5, 10.5, 19)), line(L(14, 17.5, 13.5, 19)), body(R(10, 19, 4, 2, 0.6))], { noAccent: true, anim: { preset: 'bounce', dist: -1.5 } }),
    icon('pool', 'Pool', ['swimming', 'swim', 'ladder', 'hotel', 'leisure'], [line('M8 16V5.5a2 2 0 0 1 4 0'), line('M14 16V5.5a2 2 0 0 1 4 0'), line(L(8, 9, 14, 9)), line(L(8, 12.5, 14, 12.5)), accent('M3.5 19.5c1.5-1.2 2.8-1.2 4.2 0s2.8 1.2 4.3 0 2.8-1.2 4.2 0 2.8 1.2 4.3 0')]),
    icon('campfire', 'Campfire', ['fire', 'camping', 'bonfire', 'outdoors', 'warmth'], [line(L(5, 20.5, 19, 16.5)), line(L(5, 16.5, 19, 20.5)), body('M12 3.5c2.5 2.5 4 4.5 4 7a4 4 0 0 1-8 0c0-1.5.8-2.8 2-3.8 0 1.5.7 2.5 2 2.5Z')], { noAccent: true, anim: 'wiggle' }),
  ],
};
