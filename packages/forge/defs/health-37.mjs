import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('hospital-user', 'Hospital Account', ['user', 'account', 'profile', 'hospital', 'hospital'], [body(R(3.5, 4, 12, 15.5, 1.5)), line('M9.5 7.5v4M7.5 9.5h4'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('tooth-user', 'Tooth Account', ['user', 'account', 'profile', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('syringe-user', 'Syringe Account', ['user', 'account', 'profile', 'syringe', 'syringe'], [line('M9.5 3.5v2M7.5 3.5h4'), body(R(7.5, 5.5, 4, 9, 1)), line('M9.5 14.5v3'), line('M7.7 8.3h1.8M7.7 11h1.8'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('glasses-user', 'Glasses Account', ['user', 'account', 'profile', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('thermometer-user', 'Thermometer Account', ['user', 'account', 'profile', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('hospital-bell', 'Hospital Notification', ['notification', 'reminder', 'alert', 'hospital', 'hospital'], [body(R(3.5, 4, 12, 15.5, 1.5)), line('M9.5 7.5v4M7.5 9.5h4'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('tooth-bell', 'Tooth Notification', ['notification', 'reminder', 'alert', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('syringe-bell', 'Syringe Notification', ['notification', 'reminder', 'alert', 'syringe', 'syringe'], [line('M9.5 3.5v2M7.5 3.5h4'), body(R(7.5, 5.5, 4, 9, 1)), line('M9.5 14.5v3'), line('M7.7 8.3h1.8M7.7 11h1.8'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('glasses-bell', 'Glasses Notification', ['notification', 'reminder', 'alert', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('thermometer-bell', 'Thermometer Notification', ['notification', 'reminder', 'alert', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('hospital-cloud', 'Cloud Hospital', ['cloud', 'sync', 'online', 'hospital', 'hospital'], [body(R(3.5, 4, 12, 15.5, 1.5)), line('M9.5 7.5v4M7.5 9.5h4'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('tooth-cloud', 'Cloud Tooth', ['cloud', 'sync', 'online', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
  ],
};
