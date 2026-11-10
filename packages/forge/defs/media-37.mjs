import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('headphones-user', 'Headphones Account', ['user', 'account', 'profile', 'headphones', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('tv-user', 'TV Account', ['user', 'account', 'profile', 'tv', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('mic-user', 'Mic Account', ['user', 'account', 'profile', 'mic', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('film-user', 'Film Account', ['user', 'account', 'profile', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('camera-user', 'Camera Account', ['user', 'account', 'profile', 'camera', 'camera'], [body(R(3, 6.5, 13, 10, 2)), line('M7 6.5 8 4.5h3l1 2'), line(C(9.5, 11.5, 2.5)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('music-user', 'Music Account', ['user', 'account', 'profile', 'music', 'music'], [line('M8 15.5V5.5l7-2v9.5'), body(C(6, 15.5, 2)), body(C(13, 13, 2)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('headphones-bell', 'Headphones Notification', ['notification', 'reminder', 'alert', 'headphones', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('tv-bell', 'TV Notification', ['notification', 'reminder', 'alert', 'tv', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('mic-bell', 'Mic Notification', ['notification', 'reminder', 'alert', 'mic', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('film-bell', 'Film Notification', ['notification', 'reminder', 'alert', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('camera-bell', 'Camera Notification', ['notification', 'reminder', 'alert', 'camera', 'camera'], [body(R(3, 6.5, 13, 10, 2)), line('M7 6.5 8 4.5h3l1 2'), line(C(9.5, 11.5, 2.5)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('music-bell', 'Music Notification', ['notification', 'reminder', 'alert', 'music', 'music'], [line('M8 15.5V5.5l7-2v9.5'), body(C(6, 15.5, 2)), body(C(13, 13, 2)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('headphones-cloud', 'Cloud Headphones', ['cloud', 'sync', 'online', 'headphones', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('tv-cloud', 'Cloud TV', ['cloud', 'sync', 'online', 'tv', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('mic-cloud', 'Cloud Mic', ['cloud', 'sync', 'online', 'mic', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('film-cloud', 'Cloud Film', ['cloud', 'sync', 'online', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
  ],
};
