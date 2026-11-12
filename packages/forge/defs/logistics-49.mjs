import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'logistics',
  icons: [
    icon('conveyor-pricing', 'Conveyor Pricing', ['pricing', 'cost', 'money', 'conveyor', 'conveyor'], [body(R(3, 11, 13, 4, 2)), line(D(5, 13) + D(9.5, 13) + D(14, 13)), body(R(6, 5, 7, 5, 0.8)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('parcel-locker-pricing', 'Parcel Locker Pricing', ['pricing', 'cost', 'money', 'parcel locker', 'parcel-locker'], [body(R(3, 3.5, 13, 15, 1.2)), line('M9.5 3.7v14.6M3.2 8.5h6.1M3.2 13.5h6.1M9.7 11h6.1'), line('M7.8 6v.5M7.8 11v.5M7.8 16v.5M14.3 6.5v.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
  ],
};
