import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('database-plane', 'Database Travel', ['travel', 'flight', 'trip', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body('M17 12.4c.4 0 .7.4.7.9v2.3l3.1 1.9v1.1l-3.1-.9v2l1 .8v.9l-1.7-.5-1.7.5v-.9l1-.8v-2l-3.1.9v-1.1l3.1-1.9v-2.3c0-.5.3-.9.7-.9Z', { cover: true })], { noAccent: true }),
    icon('database-battery', 'Database Power', ['power', 'battery', 'energy', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body(R(13, 14, 7, 5, 1), { cover: true }), line('M21 15.7v1.6'), line('M14.8 16.5h2.5')], { noAccent: true }),
    icon('database-bug', 'Database Bug', ['bug', 'issue', 'debug', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body(E(17, 17, 2.6, 3.3), { cover: true }), line('M17 14v6.3M14.4 16h-1.2M19.6 16h1.2M14.4 18.5h-1.2M19.6 18.5h1.2M15.6 13.8l-.8-1M18.4 13.8l.8-1')], { noAccent: true }),
    icon('database-code', 'Database Code', ['code', 'developer', 'embed', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.6 15l-1.5 1.5 1.5 1.5M18.4 15l1.5 1.5-1.5 1.5')], { noAccent: true }),
    icon('database-plug', 'Database Plugin', ['plugin', 'connect', 'power', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body('M14.3 14.5h5.4v2.5a2.7 2.7 0 0 1-5.4 0Z', { cover: true }), line('M15.8 14.5v-2M18.2 14.5v-2M17 19.7v1')], { noAccent: true }),
    icon('database-flask', 'Database Lab', ['lab', 'experiment', 'test', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body('M15.8 12.8h2.4v2.6l2.6 4.4a.8.8 0 0 1-.7 1.2h-6.2a.8.8 0 0 1-.7-1.2l2.6-4.4Z', { cover: true })], { noAccent: true }),
    icon('network-plane', 'Network Travel', ['travel', 'flight', 'trip', 'network', 'network'], [line(C(9.5, 5, 1.8)), line(C(5, 15, 1.8)), line(C(14, 15, 1.8)), line('M9.5 6.8v3.7M5 13.2v-1.5h9v1.5'), body('M17 12.4c.4 0 .7.4.7.9v2.3l3.1 1.9v1.1l-3.1-.9v2l1 .8v.9l-1.7-.5-1.7.5v-.9l1-.8v-2l-3.1.9v-1.1l3.1-1.9v-2.3c0-.5.3-.9.7-.9Z', { cover: true })], { noAccent: true }),
    icon('network-battery', 'Network Power', ['power', 'battery', 'energy', 'network', 'network'], [line(C(9.5, 5, 1.8)), line(C(5, 15, 1.8)), line(C(14, 15, 1.8)), line('M9.5 6.8v3.7M5 13.2v-1.5h9v1.5'), body(R(13, 14, 7, 5, 1), { cover: true }), line('M21 15.7v1.6'), line('M14.8 16.5h2.5')], { noAccent: true }),
    icon('network-bug', 'Network Bug', ['bug', 'issue', 'debug', 'network', 'network'], [line(C(9.5, 5, 1.8)), line(C(5, 15, 1.8)), line(C(14, 15, 1.8)), line('M9.5 6.8v3.7M5 13.2v-1.5h9v1.5'), body(E(17, 17, 2.6, 3.3), { cover: true }), line('M17 14v6.3M14.4 16h-1.2M19.6 16h1.2M14.4 18.5h-1.2M19.6 18.5h1.2M15.6 13.8l-.8-1M18.4 13.8l.8-1')], { noAccent: true }),
    icon('network-code', 'Network Code', ['code', 'developer', 'embed', 'network', 'network'], [line(C(9.5, 5, 1.8)), line(C(5, 15, 1.8)), line(C(14, 15, 1.8)), line('M9.5 6.8v3.7M5 13.2v-1.5h9v1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.6 15l-1.5 1.5 1.5 1.5M18.4 15l1.5 1.5-1.5 1.5')], { noAccent: true }),
    icon('network-plug', 'Network Plugin', ['plugin', 'connect', 'power', 'network', 'network'], [line(C(9.5, 5, 1.8)), line(C(5, 15, 1.8)), line(C(14, 15, 1.8)), line('M9.5 6.8v3.7M5 13.2v-1.5h9v1.5'), body('M14.3 14.5h5.4v2.5a2.7 2.7 0 0 1-5.4 0Z', { cover: true }), line('M15.8 14.5v-2M18.2 14.5v-2M17 19.7v1')], { noAccent: true }),
    icon('network-flask', 'Network Lab', ['lab', 'experiment', 'test', 'network', 'network'], [line(C(9.5, 5, 1.8)), line(C(5, 15, 1.8)), line(C(14, 15, 1.8)), line('M9.5 6.8v3.7M5 13.2v-1.5h9v1.5'), body('M15.8 12.8h2.4v2.6l2.6 4.4a.8.8 0 0 1-.7 1.2h-6.2a.8.8 0 0 1-.7-1.2l2.6-4.4Z', { cover: true })], { noAccent: true }),
  ],
};
