import { icon, body, line, accent } from '../src/dsl.mjs';
import { poly, rotateD, translateD } from '../src/geo.mjs';

const MASK = 'M5 4h8v6a4 4 0 0 1-8 0Z';

export default {
  category: 'media',
  icons: [
    icon('theater-masks', 'Theater Masks', ['drama', 'comedy', 'tragedy', 'theatre', 'acting'], [body(rotateD(MASK, -12, 9, 9)), body(translateD(MASK, 6, 6), { cover: true }), line('M13 12.8h1.5M16.5 12.8H18'), accent('M13.6 15.3a1.9 1.9 0 0 0 2.8 0')]),
    icon('stage-curtain', 'Stage Curtain', ['curtain', 'theatre', 'show', 'performance', 'stage'], [line('M3 3.5h18'), body('M4 3.5h6c0 6-1 10-3 13l2 4H4Z'), body('M20 3.5h-6c0 6 1 10 3 13l-2 4h5Z')], { noAccent: true }),
  ],
};
