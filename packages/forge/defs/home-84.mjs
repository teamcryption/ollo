import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('bathtub-pricing', 'Bathtub Pricing', ['pricing', 'cost', 'money', 'bathtub', 'bathtub'], [line('M5 10.5V6a2 2 0 0 1 4 0'), body('M3 10.5h13v2.5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z'), line('M5.5 17l-.8 1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('curtains-pricing', 'Curtains Pricing', ['pricing', 'cost', 'money', 'curtains', 'curtains'], [line('M3 4h13'), body('M4 4.5h4c0 4 0 8.5-1 13H4Z'), body('M15 4.5h-4c0 4 0 8.5 1 13h3Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('laundry-basket-pricing', 'Laundry Basket Pricing', ['pricing', 'cost', 'money', 'laundry basket', 'laundry-basket'], [body(poly([[4, 8], [15, 8], [13.8, 18], [5.2, 18]], 0.8, true)), line('M3.5 8h12'), line('M7.5 11v4M11.5 11v4'), line('M6.5 7.8c.5-2.5 1.5-3.8 3-3.8s2.5 1.3 3 3.8'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('video-doorbell-pricing', 'Video Doorbell Pricing', ['pricing', 'cost', 'money', 'video doorbell', 'video-doorbell'], [body(R(6, 3, 7, 15, 3.5)), line(C(9.5, 7, 1.6)), line(C(9.5, 13.5, 1.8)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('humidifier-pricing', 'Humidifier Pricing', ['pricing', 'cost', 'money', 'humidifier', 'humidifier'], [line('M8 4c-.6-.8.6-1.5 0-2.3M11 4c-.6-.8.6-1.5 0-2.3'), body('M6 6h7l1.5 12h-10Z'), line('M6.5 10.5h6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('shower-head-pricing', 'Shower Head Pricing', ['pricing', 'cost', 'money', 'shower head', 'shower-head'], [line('M4 18V8a4 4 0 0 1 4-4h3.5'), body('M10 5.5h5.5a1 1 0 0 1 1 1v.5H9v-.5a1 1 0 0 1 1-1Z'), line(D(10.5, 9.5) + D(12.75, 10.5) + D(15, 9.5) + D(11.5, 12.5) + D(14, 12.5)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('picket-fence-pricing', 'Picket Fence Pricing', ['pricing', 'cost', 'money', 'picket fence', 'picket-fence'], [body(poly([[3, 7], [4.5, 5], [6, 7], [6, 18], [3, 18]], 0.4, true)), body(poly([[8, 7], [9.5, 5], [11, 7], [11, 18], [8, 18]], 0.4, true)), body(poly([[13, 7], [14.5, 5], [16, 7], [16, 18], [13, 18]], 0.4, true)), line('M6.2 10h1.6M11.2 10h1.6M6.2 15h1.6M11.2 15h1.6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
  ],
};
