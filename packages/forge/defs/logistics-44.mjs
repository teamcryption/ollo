import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'logistics',
  icons: [
    icon('package-cursor', 'Select Package', ['select', 'click', 'pointer', 'package', 'package'], [body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('crate-cursor', 'Select Crate', ['select', 'click', 'pointer', 'crate', 'crate'], [body(R(3.5, 5, 12, 12, 1)), line('M3.7 5.2l11.6 11.6M3.7 16.8 15.3 5.2'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('conveyor-cursor', 'Select Conveyor', ['select', 'click', 'pointer', 'conveyor', 'conveyor'], [body(R(3, 11, 13, 4, 2)), line(D(5, 13) + D(9.5, 13) + D(14, 13)), body(R(6, 5, 7, 5, 0.8)), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('forklift-cursor', 'Select Forklift', ['select', 'click', 'pointer', 'forklift', 'forklift'], [line('M14 4v13.5M14 17.5h2.5'), body('M3.5 10.5V7a1.5 1.5 0 0 1 1.5-1.5h3l2.5 5V15h-7Z'), line(C(5.5, 16.5, 1.5) + C(10.5, 16.5, 1.5)), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pallet-cursor', 'Select Pallet', ['select', 'click', 'pointer', 'pallet', 'pallet'], [body(R(4, 4, 11, 8, 1)), line('M3 13.5h13M3 17h13M4.5 13.7v3.1M9.5 13.7v3.1M14.5 13.7v3.1'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('container-cursor', 'Select Shipping Container', ['select', 'click', 'pointer', 'shipping container', 'container'], [body(R(3, 6, 13, 9, 1)), line('M6 8v5M9 8v5M12 8v5'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('cargo-ship-cursor', 'Select Cargo Ship', ['select', 'click', 'pointer', 'cargo ship', 'cargo-ship'], [line('M6 9V6.5h3V9M10 9V7h3v2'), body('M2.5 10h14l-2 5h-10Z'), line('M3 17.5c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('parcel-locker-cursor', 'Select Parcel Locker', ['select', 'click', 'pointer', 'parcel locker', 'parcel-locker'], [body(R(3, 3.5, 13, 15, 1.2)), line('M9.5 3.7v14.6M3.2 8.5h6.1M3.2 13.5h6.1M9.7 11h6.1'), line('M7.8 6v.5M7.8 11v.5M7.8 16v.5M14.3 6.5v.5'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('return-box-cursor', 'Select Return', ['select', 'click', 'pointer', 'return', 'return-box'], [body(R(3.5, 6, 12, 11.5, 1.2)), line('M3.7 9.5h11.6'), line('M8 13.5h3.5a1.5 1.5 0 0 0 0-3H8M9 12.3l-1.2 1.2L9 14.7'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('warehouse-cursor', 'Select Warehouse', ['select', 'click', 'pointer', 'warehouse', 'warehouse'], [body('M3 8l6.5-4L16 8v10H3Z'), line('M6 18v-6h7v6M6 14.5h7'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
