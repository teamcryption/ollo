import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('layout-sidebar-question', 'Layout Sidebar Help', ['help', 'question', 'support', 'layout sidebar', 'layout-sidebar'], [body(R(3, 4, 13, 12.5, 1.5)), line('M7.5 4.2v12.1M4.7 7h1.5M4.7 9.5h1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('toggle-switch-question', 'Toggle Switch Help', ['help', 'question', 'support', 'toggle switch', 'toggle-switch'], [body(R(2.5, 6.5, 14, 7.5, 3.75)), line(C(12.75, 10.25, 2.2)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('checkbox-list-question', 'Checkbox List Help', ['help', 'question', 'support', 'checkbox list', 'checkbox-list'], [body(R(3, 4, 4, 4, 0.8)), line('M4 6l.8.8 1.4-1.6'), body(R(3, 12, 4, 4, 0.8)), line('M9.5 6h6.5M9.5 14h6.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('dropdown-question', 'Dropdown Help', ['help', 'question', 'support', 'dropdown', 'dropdown'], [body(R(3, 6.5, 13, 7, 1.5)), line('M5.5 10h4'), line('M11.5 9l1.5 1.5L14.5 9'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('layout-sidebar-calendar', 'Layout Sidebar Booking', ['booking', 'date', 'appointment', 'layout sidebar', 'layout-sidebar'], [body(R(3, 4, 13, 12.5, 1.5)), line('M7.5 4.2v12.1M4.7 7h1.5M4.7 9.5h1.5'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('toggle-switch-calendar', 'Toggle Switch Booking', ['booking', 'date', 'appointment', 'toggle switch', 'toggle-switch'], [body(R(2.5, 6.5, 14, 7.5, 3.75)), line(C(12.75, 10.25, 2.2)), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('checkbox-list-calendar', 'Checkbox List Booking', ['booking', 'date', 'appointment', 'checkbox list', 'checkbox-list'], [body(R(3, 4, 4, 4, 0.8)), line('M4 6l.8.8 1.4-1.6'), body(R(3, 12, 4, 4, 0.8)), line('M9.5 6h6.5M9.5 14h6.5'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('dropdown-calendar', 'Dropdown Booking', ['booking', 'date', 'appointment', 'dropdown', 'dropdown'], [body(R(3, 6.5, 13, 7, 1.5)), line('M5.5 10h4'), line('M11.5 9l1.5 1.5L14.5 9'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('layout-sidebar-sparkle', 'AI Layout Sidebar', ['ai', 'smart', 'magic', 'layout sidebar', 'layout-sidebar'], [body(R(3, 4, 13, 12.5, 1.5)), line('M7.5 4.2v12.1M4.7 7h1.5M4.7 9.5h1.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('toggle-switch-sparkle', 'AI Toggle Switch', ['ai', 'smart', 'magic', 'toggle switch', 'toggle-switch'], [body(R(2.5, 6.5, 14, 7.5, 3.75)), line(C(12.75, 10.25, 2.2)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('checkbox-list-sparkle', 'AI Checkbox List', ['ai', 'smart', 'magic', 'checkbox list', 'checkbox-list'], [body(R(3, 4, 4, 4, 0.8)), line('M4 6l.8.8 1.4-1.6'), body(R(3, 12, 4, 4, 0.8)), line('M9.5 6h6.5M9.5 14h6.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('dropdown-sparkle', 'AI Dropdown', ['ai', 'smart', 'magic', 'dropdown', 'dropdown'], [body(R(3, 6.5, 13, 7, 1.5)), line('M5.5 10h4'), line('M11.5 9l1.5 1.5L14.5 9'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
