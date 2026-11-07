import { L, E, rotateD } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

const HEART = 'M12 11.5C9 9.5 8 8 8.6 6.4 9.3 4.8 11.3 4.8 12 6.4c.7-1.6 2.7-1.6 3.4 0 .6 1.6-.4 3.1-3.4 5.1Z';

export default {
  category: 'nature',
  icons: [
    icon('palm-tree', 'Palm Tree', ['tropical', 'beach', 'island', 'coconut', 'holiday'], [line('M10.5 20.5c0-4 .8-8 2.5-11'), body('M13 9.5C10.5 6 6.5 5.5 3.5 7.5c3.5-.5 6.5.5 9.5 2Z'), body('M13 9.5c1.5-4 5-5.5 7.5-4.5-3 .5-5.5 2-7.5 4.5Z'), body('M13 9.5c-3 0-6 1.5-7 4.5 2.5-2 5-3.5 7-4.5Z'), body('M13 9.5c3 0 5.5 1.5 6.5 4.5-2-2-4.5-3.5-6.5-4.5Z'), line(L(6, 20.5, 16, 20.5))], { noAccent: true, anim: 'wiggle' }),
    icon('clover', 'Clover', ['four leaf clover', 'luck', 'shamrock', 'lucky', 'irish'], [...[45, 135, 225, 315].map((a) => body(rotateD(HEART, a, 12, 12))), line('M12 13.5c0 3 .5 5.5 2 7')], { noAccent: true, anim: 'wiggle' }),
    icon('cairn', 'Cairn', ['stones', 'rocks', 'balance', 'zen', 'pebbles'], [body(E(12, 17.5, 7.5, 3)), body(E(12, 12.3, 5.5, 2.6), { cover: true }), body(E(12, 7.6, 3.6, 2.1), { cover: true })], { noAccent: true }),
    icon('branch', 'Branch', ['twig', 'leaves', 'olive branch', 'plant', 'peace'], [line('M5 19.5 18.5 6'), body('M9.5 15c-1-3-4-4-6-3.5.5 2 3 4 6 3.5Z'), body('M12.5 12c3 1 4 4 3.5 6-2-.5-4-3-3.5-6Z'), body('M14.5 10c-1-3-4-4-6-3.5.5 2 3 4 6 3.5Z'), body('M16.5 8c3 1 4 4 3.5 6-2-.5-4-3-3.5-6Z')], { noAccent: true, anim: 'wiggle' }),
  ],
};
