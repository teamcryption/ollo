import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('wallet-search', 'Search Wallet', ['search', 'find', 'lookup', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('wallet-pin', 'Wallet Location', ['location', 'place', 'map', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('wallet-alert', 'Wallet Alert', ['alert', 'warning', 'problem', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('wallet-user', 'Wallet Account', ['user', 'account', 'profile', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('wallet-bell', 'Wallet Notification', ['notification', 'reminder', 'alert', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('wallet-cloud', 'Cloud Wallet', ['cloud', 'sync', 'online', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('wallet-chat', 'Wallet Chat', ['chat', 'support', 'message', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('wallet-download', 'Download Wallet', ['download', 'save', 'export', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('wallet-pencil', 'Edit Wallet', ['edit', 'write', 'modify', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
