import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'social',
  icons: [
    icon('hashtag-buy', 'Buy Hashtag', ['buy', 'shopping', 'purchase', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body('M13.6 15h6.8l-.6 5.5h-5.6Z', { cover: true }), line('M15.6 15v-.8a1.4 1.4 0 0 1 2.8 0v.8')], { noAccent: true }),
    icon('hashtag-plane', 'Hashtag Travel', ['travel', 'flight', 'trip', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body('M17 12.4c.4 0 .7.4.7.9v2.3l3.1 1.9v1.1l-3.1-.9v2l1 .8v.9l-1.7-.5-1.7.5v-.9l1-.8v-2l-3.1.9v-1.1l3.1-1.9v-2.3c0-.5.3-.9.7-.9Z', { cover: true })], { noAccent: true }),
    icon('hashtag-battery', 'Hashtag Power', ['power', 'battery', 'energy', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body(R(13, 14, 7, 5, 1), { cover: true }), line('M21 15.7v1.6'), line('M14.8 16.5h2.5')], { noAccent: true }),
    icon('hashtag-bug', 'Hashtag Bug', ['bug', 'issue', 'debug', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body(E(17, 17, 2.6, 3.3), { cover: true }), line('M17 14v6.3M14.4 16h-1.2M19.6 16h1.2M14.4 18.5h-1.2M19.6 18.5h1.2M15.6 13.8l-.8-1M18.4 13.8l.8-1')], { noAccent: true }),
    icon('hashtag-code', 'Hashtag Code', ['code', 'developer', 'embed', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.6 15l-1.5 1.5 1.5 1.5M18.4 15l1.5 1.5-1.5 1.5')], { noAccent: true }),
    icon('hashtag-plug', 'Hashtag Plugin', ['plugin', 'connect', 'power', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body('M14.3 14.5h5.4v2.5a2.7 2.7 0 0 1-5.4 0Z', { cover: true }), line('M15.8 14.5v-2M18.2 14.5v-2M17 19.7v1')], { noAccent: true }),
    icon('hashtag-flask', 'Hashtag Lab', ['lab', 'experiment', 'test', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body('M15.8 12.8h2.4v2.6l2.6 4.4a.8.8 0 0 1-.7 1.2h-6.2a.8.8 0 0 1-.7-1.2l2.6-4.4Z', { cover: true })], { noAccent: true }),
  ],
};
