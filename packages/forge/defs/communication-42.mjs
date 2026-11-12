import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('message-flag', 'Report Message', ['report', 'flag', 'mark', 'message', 'message'], [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('phone-flag', 'Report Phone', ['report', 'flag', 'mark', 'phone', 'phone'], [body('M5.5 3.5h2.5l1.3 3.2-1.8 1.3a8 8 0 0 0 3.5 3.5l1.3-1.8 3.2 1.3v2.5A1.5 1.5 0 0 1 14 15c-6 0-10-4-10-10a1.5 1.5 0 0 1 1.5-1.5Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('video-flag', 'Report Video', ['report', 'flag', 'mark', 'video', 'video'], [body(R(3, 6, 9.5, 8, 1.5)), body(poly([[13.3, 8.5], [16, 7], [16, 13], [13.3, 11.5]], 0.5, true)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('inbox-flag', 'Report Inbox', ['report', 'flag', 'mark', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('newspaper-flag', 'Report Newspaper', ['report', 'flag', 'mark', 'newspaper', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('stamp-flag', 'Report Stamp', ['report', 'flag', 'mark', 'stamp', 'stamp'], [body(C(9.5, 5, 1.8)), line('M9.5 6.9v2.6'), body(R(4, 9.6, 11, 4, 1.2)), line('M4 16.8h11'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('satellite-dish-flag', 'Report Satellite Dish', ['report', 'flag', 'mark', 'satellite dish', 'satellite-dish'], [body('M4.5 5.5l9 9a6.4 6.4 0 0 1-9-9Z'), line('M9 10l3-3'), line(D(12.8, 6.2)), line('M7.2 15.3 5.5 18.5h5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('antenna-flag', 'Report Antenna', ['report', 'flag', 'mark', 'antenna', 'antenna'], [line('M6.5 4.5a4.2 4.2 0 0 0 0 6M12.5 4.5a4.2 4.2 0 0 1 0 6'), body(C(9.5, 7.5, 1.5)), line('M9.5 9.2v9.3M6.5 18.5h6'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('walkie-talkie-flag', 'Report Walkie Talkie', ['report', 'flag', 'mark', 'walkie talkie', 'walkie-talkie'], [line('M7 6V3'), body(R(5, 6, 9, 12.5, 2)), line('M7.5 9.5h4M7.5 11.5h4'), line(D(9.5, 15)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('paper-plane-flag', 'Report Paper Plane', ['report', 'flag', 'mark', 'paper plane', 'paper-plane'], [body(poly([[3, 9.5], [16, 3.5], [11.5, 17], [9, 11.5]], 0.6, true)), line('M9.2 11.3 15.8 3.8'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('mail-flag', 'Report Mail', ['report', 'flag', 'mark', 'mail', 'mail'], [body(R(3, 5.5, 13, 10, 1.8)), line('M3.5 6.5l6 4.5 6-4.5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('mailbox-flag', 'Report Mailbox', ['report', 'flag', 'mark', 'mailbox', 'mailbox'], [body('M4 8.5A3.5 3.5 0 0 1 7.5 5h5A3.5 3.5 0 0 1 16 8.5V14H4Z'), line('M9.5 14v4.5'), line('M7.5 8.5v2'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('envelope-open-flag', 'Report Open Mail', ['report', 'flag', 'mark', 'open mail', 'envelope-open'], [body('M3 9l6.5-5 6.5 5v8.5H3Z'), line('M3.3 9.3l6.2 4.2 6.2-4.2'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('postcard-flag', 'Report Postcard', ['report', 'flag', 'mark', 'postcard', 'postcard'], [body(R(3, 5, 13, 10, 1.5)), line('M9.5 5.2v9.6M5.5 8.5h2M5.5 11h2'), line(R(11.5, 7, 2.5, 3, 0.4)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('signal-flag', 'Report Signal', ['report', 'flag', 'mark', 'signal', 'signal'], [body(R(3.5, 13, 2.6, 4.5, 0.8)), body(R(7.7, 9.5, 2.6, 8, 0.8)), body(R(11.9, 6, 2.6, 11.5, 0.8)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
