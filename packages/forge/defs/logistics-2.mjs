import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('pallet', 'Pallet', ['skid', 'freight', 'shipment', 'stock', 'load'], [body(R(5, 5, 14, 9, 1.5)), accent(L(10, 9.5, 14, 9.5)), line(L(3, 16.5, 21, 16.5)), line(L(3, 20.5, 21, 20.5)), line(L(4.5, 16.5, 4.5, 20.5)), line(L(12, 16.5, 12, 20.5)), line(L(19.5, 16.5, 19.5, 20.5))]),
    icon('forklift', 'Forklift', ['lift truck', 'warehouse', 'loading', 'freight'], [body('M3.5 17V11a2 2 0 0 1 2-2h3l2.5 4H13v4Z'), line(L(15, 4, 15, 19)), line(L(15, 19, 20.5, 19)), body(C(6, 18.5, 2), { cover: true }), body(C(11.5, 18.5, 2), { cover: true }), accent(R(17, 12, 3.5, 4, 0.8))]),
    icon('conveyor', 'Conveyor', ['conveyor belt', 'production', 'sorting', 'assembly line'], [body(R(3, 13, 18, 6, 3)), line(D(6, 16)), line(D(12, 16)), line(D(18, 16)), body(R(5, 5, 5.5, 5.5, 1)), accent(R(13, 6.5, 4.5, 4, 1))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('shelves', 'Inventory', ['shelving', 'stock', 'storage', 'rack', 'warehouse'], [line('M4 3.5v17M20 3.5v17'), line(L(4, 10, 20, 10)), line(L(4, 16.5, 20, 16.5)), body(R(6, 5.5, 4, 4.5, 0.8)), body(R(11, 6.5, 3.5, 3.5, 0.8)), body(R(12.5, 12, 5, 4.5, 0.8))], { noAccent: true }),
    icon('parcel-scale', 'Parcel Scale', ['weigh', 'shipping scale', 'weight', 'postage'], [body(R(7, 4, 10, 7, 1.5)), line(L(5, 12.5, 19, 12.5)), body(R(3.5, 14.5, 17, 6, 2)), accent(L(10.5, 17.5, 13.5, 17.5))]),
    icon('box-open', 'Open Box', ['unbox', 'unpack', 'package', 'delivery', 'opened'], [line('M4.5 10 3 6.5h6L10.5 10'), line('M19.5 10 21 6.5h-6L13.5 10'), body('M4.5 10h15v9a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19Z'), accent(L(9.5, 14.5, 14.5, 14.5))], { badges: ['check'] }),
  ],
};
