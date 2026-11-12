import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'logistics',
  icons: [
    icon('package-crown', 'Premium Package', ['premium', 'pro', 'vip', 'package', 'package'], [body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('crate-crown', 'Premium Crate', ['premium', 'pro', 'vip', 'crate', 'crate'], [body(R(3.5, 5, 12, 12, 1)), line('M3.7 5.2l11.6 11.6M3.7 16.8 15.3 5.2'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('conveyor-crown', 'Premium Conveyor', ['premium', 'pro', 'vip', 'conveyor', 'conveyor'], [body(R(3, 11, 13, 4, 2)), line(D(5, 13) + D(9.5, 13) + D(14, 13)), body(R(6, 5, 7, 5, 0.8)), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('forklift-crown', 'Premium Forklift', ['premium', 'pro', 'vip', 'forklift', 'forklift'], [line('M14 4v13.5M14 17.5h2.5'), body('M3.5 10.5V7a1.5 1.5 0 0 1 1.5-1.5h3l2.5 5V15h-7Z'), line(C(5.5, 16.5, 1.5) + C(10.5, 16.5, 1.5)), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('pallet-crown', 'Premium Pallet', ['premium', 'pro', 'vip', 'pallet', 'pallet'], [body(R(4, 4, 11, 8, 1)), line('M3 13.5h13M3 17h13M4.5 13.7v3.1M9.5 13.7v3.1M14.5 13.7v3.1'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('container-crown', 'Premium Shipping Container', ['premium', 'pro', 'vip', 'shipping container', 'container'], [body(R(3, 6, 13, 9, 1)), line('M6 8v5M9 8v5M12 8v5'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('cargo-ship-crown', 'Premium Cargo Ship', ['premium', 'pro', 'vip', 'cargo ship', 'cargo-ship'], [line('M6 9V6.5h3V9M10 9V7h3v2'), body('M2.5 10h14l-2 5h-10Z'), line('M3 17.5c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('parcel-locker-crown', 'Premium Parcel Locker', ['premium', 'pro', 'vip', 'parcel locker', 'parcel-locker'], [body(R(3, 3.5, 13, 15, 1.2)), line('M9.5 3.7v14.6M3.2 8.5h6.1M3.2 13.5h6.1M9.7 11h6.1'), line('M7.8 6v.5M7.8 11v.5M7.8 16v.5M14.3 6.5v.5'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('return-box-crown', 'Premium Return', ['premium', 'pro', 'vip', 'return', 'return-box'], [body(R(3.5, 6, 12, 11.5, 1.2)), line('M3.7 9.5h11.6'), line('M8 13.5h3.5a1.5 1.5 0 0 0 0-3H8M9 12.3l-1.2 1.2L9 14.7'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('warehouse-crown', 'Premium Warehouse', ['premium', 'pro', 'vip', 'warehouse', 'warehouse'], [body('M3 8l6.5-4L16 8v10H3Z'), line('M6 18v-6h7v6M6 14.5h7'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('package-moon', 'Package Night Mode', ['night', 'dark mode', 'sleep', 'package', 'package'], [body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('crate-moon', 'Crate Night Mode', ['night', 'dark mode', 'sleep', 'crate', 'crate'], [body(R(3.5, 5, 12, 12, 1)), line('M3.7 5.2l11.6 11.6M3.7 16.8 15.3 5.2'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
  ],
};
