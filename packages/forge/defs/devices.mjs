import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'devices',
  icons: [
    icon('smartphone', 'Smartphone', ['mobile', 'phone', 'iphone', 'android', 'device'], [body(R(6.5, 2.5, 11, 19, 3)), accent(L(10.5, 5.5, 13.5, 5.5)), line(L(11, 18.5, 13, 18.5))], { badges: ['check', 'close', 'alert'] }),
    icon('tablet', 'Tablet', ['ipad', 'device', 'screen', 'reader'], [body(R(4, 2.5, 16, 19, 3)), accent(L(10.5, 18.5, 13.5, 18.5))]),
    icon('laptop', 'Laptop', ['computer', 'notebook', 'macbook', 'work'], [body(R(5, 4.5, 14, 10.5, 2)), line('M2.5 18h19l-1 1.5a1.5 1.5 0 0 1-1.3.7H4.8a1.5 1.5 0 0 1-1.3-.7Z'), accent(L(10, 8.5, 14, 8.5))]),
    icon('monitor', 'Monitor', ['desktop', 'display', 'screen', 'computer'], [body(R(3, 4, 18, 12, 2.5)), line(L(12, 16.2, 12, 19.5)), line(L(8.5, 20, 15.5, 20)), accent(L(7, 8, 10, 8))]),
    icon('watch-smart', 'Smart Watch', ['wearable', 'fitness', 'tracker', 'wrist'], [line('M9 6.5 9.5 3.5h5l.5 3'), line('M9 17.5l.5 3h5l.5-3'), body(R(6.5, 6.5, 11, 11, 3)), accent(poly([[9.3, 12.3], [10.8, 12.3], [11.6, 10.4], [12.6, 14], [13.4, 12.3], [14.8, 12.3]], 0.3))], { anim: 'pulse' }),
    icon('keyboard', 'Keyboard', ['type', 'input', 'keys', 'typing'], [body(R(2.5, 6, 19, 12, 2.5)), line(D(6.5, 10)), line(D(9.5, 10)), line(D(12.5, 10)), line(D(15.5, 10)), line(D(18, 10)), accent(L(8, 14.5, 16, 14.5))]),
    icon('mouse', 'Mouse', ['click', 'pointer', 'computer', 'scroll'], [body(R(6.5, 3, 11, 18, 5.5)), accent(L(12, 7, 12, 10))], { anim: { preset: 'bounce', dist: -1.5 } }),
    icon('server-rack', 'Server', ['server', 'rack', 'hosting', 'datacenter'], [body(R(3.5, 3.5, 17, 7, 2)), body(R(3.5, 13.5, 17, 7, 2)), line(D(7, 7)), line(D(7, 17)), accent(L(12, 7, 16.5, 7)), line(L(12, 17, 16.5, 17))]),
    icon('cpu', 'Processor', ['chip', 'cpu', 'hardware', 'processor', 'computing'], [body(R(6, 6, 12, 12, 2.5)), line(L(9.5, 3, 9.5, 5)), line(L(14.5, 3, 14.5, 5)), line(L(9.5, 19, 9.5, 21)), line(L(14.5, 19, 14.5, 21)), line(L(3, 9.5, 5, 9.5)), line(L(3, 14.5, 5, 14.5)), line(L(19, 9.5, 21, 9.5)), line(L(19, 14.5, 21, 14.5)), accent(R(10, 10, 4, 4, 1))]),
    icon('hard-drive', 'Hard Drive', ['storage', 'disk', 'ssd', 'backup'], [body(R(3, 13, 18, 7, 2.5)), line('M4.2 13.3 6.7 5.6A2.2 2.2 0 0 1 8.8 4h6.4a2.2 2.2 0 0 1 2.1 1.6l2.5 7.7'), line(D(7, 16.5)), accent(L(11, 16.5, 17, 16.5))]),
    icon('battery', 'Battery', ['power', 'charge', 'energy', 'level'], [body(R(2.5, 7, 16.5, 10, 2.5)), line(L(21.2, 10.5, 21.2, 13.5)), accent(L(6, 12, 11, 12))], { variants: [{ name: 'battery-charging', title: 'Battery Charging', tags: ['charging', 'power', 'plug', 'energy'], els: [body(R(2.5, 7, 16.5, 10, 2.5)), line(L(21.2, 10.5, 21.2, 13.5)), accent(poly([[11.6, 9], [9.6, 12.2], [12.2, 12.2], [10.6, 15]], 0.3))] }, { name: 'battery-low', title: 'Battery Low', tags: ['low', 'empty', 'drain', 'power'], els: [body(R(2.5, 7, 16.5, 10, 2.5)), line(L(21.2, 10.5, 21.2, 13.5)), accent(L(6, 12, 7, 12))] }, { name: 'battery-full', title: 'Battery Full', tags: ['full', 'charged', 'power', 'energy'], els: [body(R(2.5, 7, 16.5, 10, 2.5)), line(L(21.2, 10.5, 21.2, 13.5)), accent(L(6, 12, 15.5, 12))] }] }),
    icon('wifi', 'Wi-Fi', ['wireless', 'internet', 'network', 'signal', 'connection'], [line(A(12, 19, 14, 225, 315)), line(A(12, 19, 9.5, 225, 315)), accent(A(12, 19, 5, 225, 315)), line(D(12, 19))], { anim: 'pulse', variants: [{ name: 'wifi-off', title: 'Wi-Fi Off', tags: ['offline', 'disconnected', 'no internet'], els: [line(A(12, 19, 14, 225, 315)), line(A(12, 19, 9.5, 225, 315)), line(A(12, 19, 5, 225, 315)), line(D(12, 19)), line(L(4.5, 4.5, 19.5, 19.5), { cover: true })], noAccent: true }] }),
    icon('bluetooth', 'Bluetooth', ['wireless', 'connect', 'pair', 'device'], [line(poly([[7, 8], [16.5, 16], [12, 20], [12, 4], [16.5, 8], [7, 16]], 0.6))], { noAccent: true, anim: 'pulse' }),
    icon('plug', 'Plug', ['power', 'electric', 'connect', 'socket', 'charge'], [line(L(9, 3, 9, 7)), line(L(15, 3, 15, 7)), body('M6 7h12v3a6 6 0 0 1-12 0Z'), line(L(12, 16.2, 12, 21)), accent(L(10.5, 10, 13.5, 10))]),
    icon('gamepad', 'Gamepad', ['game', 'controller', 'console', 'play'], [body('M7.5 7h9a4.5 4.5 0 0 1 4.4 3.6l.9 4.6a2.5 2.5 0 0 1-4.2 2.3L15.3 15H8.7l-2.3 2.5a2.5 2.5 0 0 1-4.2-2.3l.9-4.6A4.5 4.5 0 0 1 7.5 7Z'), line(L(6.5, 11, 9.5, 11)), line(L(8, 9.5, 8, 12.5)), accent(D(15, 10.3)), line(D(17, 12))]),
    icon('router', 'Router', ['modem', 'network', 'internet', 'wifi'], [body(R(3, 13, 18, 7, 2.5)), line(L(17, 12.8, 17, 9)), line(D(7, 16.5)), line(D(10, 16.5)), accent(A(17, 9, 3, 220, 320)), line(A(17, 9, 5.5, 225, 315))]),
  ],
};
