import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('tooth-clock', 'Dental Appointment', ['dentist booking', 'checkup time', 'dental', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('tooth-pin', 'Dentist Nearby', ['dental clinic location', 'find dentist', 'map', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('tooth-shield', 'Dental Insurance', ['dental cover', 'protected teeth', 'insurance', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
