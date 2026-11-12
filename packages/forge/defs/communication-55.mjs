import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('video-bulb', 'Video Ideas', ['idea', 'tip', 'insight', 'video', 'video'], [body(R(3, 6, 9.5, 8, 1.5)), body(poly([[13.3, 8.5], [16, 7], [16, 13], [13.3, 11.5]], 0.5, true)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('signal-bulb', 'Signal Ideas', ['idea', 'tip', 'insight', 'signal', 'signal'], [body(R(3.5, 13, 2.6, 4.5, 0.8)), body(R(7.7, 9.5, 2.6, 8, 0.8)), body(R(11.9, 6, 2.6, 11.5, 0.8)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('fax-bulb', 'Fax Ideas', ['idea', 'tip', 'insight', 'fax', 'fax'], [body(R(3, 8, 13, 9.5, 1.5)), body('M5.5 3.5h6l2 2v2.3h-8Z'), line(D(10.5, 11) + D(13, 11) + D(10.5, 14) + D(13, 14)), line('M5 11h3v4H5Z'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('video-call-bulb', 'Video Call Ideas', ['idea', 'tip', 'insight', 'video call', 'video-call'], [body(R(2.5, 5, 10, 10, 2)), line('M12.7 8.5 16.5 6v8l-3.8-2.5'), body(C(7.5, 8.5, 1.5)), line('M5 13a2.5 2.5 0 0 1 5 0'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('phone-call-bulb', 'Call Ideas', ['idea', 'tip', 'insight', 'call', 'phone-call'], [body('M5.5 3.5h2.5l1.2 3.5-1.7 1.2a8 8 0 0 0 4.3 4.3l1.2-1.7 3.5 1.2V14.5a2 2 0 0 1-2 2C8.5 16.5 3.5 11.5 3.5 5.5a2 2 0 0 1 2-2Z'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
