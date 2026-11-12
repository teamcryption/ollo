import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('briefcase-calendar', 'Briefcase Booking', ['booking', 'date', 'appointment', 'briefcase', 'briefcase'], [line('M7 7.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 12 6v1.5'), body(R(3, 7.5, 13, 10, 2)), line('M3.2 11.5h12.6'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('lightbulb-calendar', 'Lightbulb Booking', ['booking', 'date', 'appointment', 'lightbulb', 'lightbulb'], [body('M7 13.5v-1c0-.8-.4-1.4-1-2a4.6 4.6 0 1 1 6.5 0c-.6.6-1 1.2-1 2v1Z'), line('M7.3 16h3.9'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('clipboard-calendar', 'Clipboard Booking', ['booking', 'date', 'appointment', 'clipboard', 'clipboard'], [body(R(4, 4.5, 10, 13, 2)), body(R(6.5, 3, 5, 2.5, 1), { cover: true }), line('M6.5 9h5M6.5 12h3'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('megaphone-calendar', 'Megaphone Booking', ['booking', 'date', 'appointment', 'megaphone', 'megaphone'], [body('M3 8.5h3l7.5-4v12L6 12.5H3Z'), line('M5 12.5l1 3.5'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('contract-calendar', 'Contract Booking', ['booking', 'date', 'appointment', 'contract', 'contract'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('rocket-calendar', 'Rocket Booking', ['booking', 'date', 'appointment', 'rocket', 'rocket'], [body('M9.5 3c2.2 1.6 3.3 4 3.3 7v4.5H6.2V10c0-3 1.1-5.4 3.3-7Z'), line('M6.2 11.5 4 14v3l2.2-1.5M12.8 11.5 15 14v3l-2.2-1.5'), line(C(9.5, 8.5, 1.3)), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('target-calendar', 'Target Booking', ['booking', 'date', 'appointment', 'target', 'target'], [line(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 3.5)), line(D(9.5, 10.5)), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('scale-calendar', 'Justice Scale Booking', ['booking', 'date', 'appointment', 'justice scale', 'scale'], [line('M9.5 3.5v14M6 17.8h7M5 6h9'), line('M5 6.2l-2 4.2M5 6.2l2 4.2M14 6.2l-2 4.2M14 6.2l2 4.2'), body('M2.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M11.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('presentation-calendar', 'Presentation Booking', ['booking', 'date', 'appointment', 'presentation', 'presentation'], [body(R(3, 3.5, 13, 9, 1.2)), line('M9.5 12.5V15M6.5 18l3-3 3 3'), line('M6 9.5l2.5-2.5 2 2L13 6.5'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('id-badge-calendar', 'ID Badge Booking', ['booking', 'date', 'appointment', 'id badge', 'id-badge'], [line('M8 3.5h3v2.5H8Z'), body(R(5, 5, 9, 13, 1.5)), line(C(9.5, 10, 1.6)), line('M7 15c.5-1.3 1.3-2 2.5-2s2 .7 2.5 2'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('filing-cabinet-calendar', 'Filing Cabinet Booking', ['booking', 'date', 'appointment', 'filing cabinet', 'filing-cabinet'], [body(R(4.5, 3, 10, 15, 1.5)), line('M4.7 8h9.6M4.7 13h9.6'), line('M8 5.5h3M8 10.5h3M8 15.5h3'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('pin-board-calendar', 'Pin Board Booking', ['booking', 'date', 'appointment', 'pin board', 'pin-board'], [body(R(3, 4, 13, 11, 1.2)), body(R(5, 6, 4, 3.5, 0.5)), line('M11 7h3M11 9.5h3M5.5 12h8'), line('M6.5 15.2 5.5 18M12.5 15.2l1 2.8'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
  ],
};
