import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly, rotateD } from '../src/geo.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('bulldozer', 'Bulldozer', ['dozer', 'construction', 'earthmover', 'site', 'tractor'], [body(R(5.5, 6.5, 6.5, 7, 1)), body(R(3, 16, 13, 4.5, 2.25), { cover: true }), line('M12 12h5.5'), body(poly([[17.5, 8], [20.5, 8.5], [21, 20.5], [17.5, 20.5]], 0.6, true))], { noAccent: true }),
    icon('dump-truck', 'Dump Truck', ['tipper', 'construction', 'gravel', 'hauler', 'truck'], [body(rotateD(R(4.2, 9.5, 10, 5, 1), -15, 14, 14.5)), body('M15.5 9h2.6a1.5 1.5 0 0 1 1.3.8l1.4 2.7a1.5 1.5 0 0 1 .2.7v2.8H15.5Z'), line('M3.5 16.5h12'), body(C(6.5, 18.5, 1.8), { cover: true }), body(C(17, 18.5, 1.8), { cover: true })], { noAccent: true }),
  ],
};
