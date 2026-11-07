import { R, C, L, A, poly, D, E } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'devices',
  icons: [
    icon('computer-tower', 'Computer Tower', ['pc', 'desktop', 'case', 'workstation'], [body(R(7, 3, 10, 18, 2)), line(L(9.5, 6.5, 14.5, 6.5)), line(L(9.5, 9.5, 14.5, 9.5)), accent(D(12, 16.5))]),
    icon('tv', 'Television', ['tv', 'screen', 'broadcast', 'watch', 'channel'], [line(L(8.5, 2.8, 11.5, 5.3)), line(L(15.5, 2.8, 12.5, 5.3)), body(R(3, 5.5, 18, 12.5, 2.5)), line(L(7, 18.2, 6, 20.5)), line(L(17, 18.2, 18, 20.5)), accent(L(6.5, 9, 9, 9))]),
    icon('headset', 'Headset', ['support', 'call centre', 'gaming', 'microphone', 'audio'], [line(A(12, 12, 7.5, 180, 360)), body(R(3.5, 11.5, 4, 6.5, 1.8)), body(R(16.5, 11.5, 4, 6.5, 1.8)), line('M18.5 18.2v.3a2.5 2.5 0 0 1-2.5 2.5h-2'), accent(D(11.5, 21))]),
    icon('webcam', 'Webcam', ['camera', 'video', 'stream', 'meeting', 'facetime'], [body(C(12, 10, 6.5)), line(C(12, 10, 2.5)), line(L(12, 16.7, 12, 19.5)), line(L(8, 20, 16, 20)), accent(D(12, 10))]),
    icon('usb-drive', 'USB Drive', ['flash drive', 'thumb drive', 'storage', 'stick', 'memory'], [line(R(9, 3.5, 6, 5.5, 1)), body(R(7, 9, 10, 12, 2.5)), line(D(10.8, 6)), line(D(13.2, 6)), accent(L(10.5, 14, 13.5, 14))]),
    icon('sd-card', 'SD Card', ['memory card', 'storage', 'camera', 'micro sd'], [body('M8.5 3H15l3 3v13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5V5.5A2.5 2.5 0 0 1 8.5 3Z'), line(L(9, 6, 9, 8.5)), line(L(11.5, 6, 11.5, 8.5)), accent(L(14, 6.5, 14, 8.5))]),
    icon('sim-card', 'SIM Card', ['sim', 'carrier', 'mobile', 'cellular', 'esim'], [body('M8 3h6.5L18 6.5V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z'), line(R(9, 11, 6, 6.5, 1)), accent(L(9.5, 6.5, 12, 6.5))]),
    icon('memory', 'Memory', ['ram', 'module', 'hardware', 'dimm', 'stick'], [body(R(2.5, 7, 19, 9, 1.5)), line(R(4.5, 9.5, 3.5, 4, 0.5)), accent(R(10.25, 9.5, 3.5, 4, 0.5)), line(R(16, 9.5, 3.5, 4, 0.5)), ...[5, 7.5, 10, 14, 16.5, 19].map((x) => line(L(x, 16.2, x, 18.5)))]),
    icon('ethernet', 'Ethernet', ['lan', 'network port', 'cable', 'rj45', 'wired'], [body(R(3.5, 3.5, 17, 17, 3)), line(poly([[7.5, 16.5], [7.5, 11], [9.5, 11], [9.5, 8], [14.5, 8], [14.5, 11], [16.5, 11], [16.5, 16.5]], 0.4, true)), accent(L(12, 13, 12, 14.5))]),
    icon('projector', 'Projector', ['presentation', 'beamer', 'cinema', 'slides'], [body(R(3, 8, 18, 9, 2.5)), line(C(16, 12.5, 2.5)), line(L(6.5, 17.2, 6.5, 19)), line(L(17.5, 17.2, 17.5, 19)), accent(L(6, 11.5, 9.5, 11.5)), line(L(16, 4, 16, 6)), line(L(19.2, 5.3, 18.2, 6.6))]),
    icon('drone', 'Drone', ['quadcopter', 'aerial', 'uav', 'flying camera'], [body(R(9, 10, 6, 4.5, 1.5)), line(L(9, 10.5, 6, 7)), line(L(15, 10.5, 18, 7)), line(L(9, 14, 6, 17.5)), line(L(15, 14, 18, 17.5)), line(E(6, 5.5, 3, 1.1)), line(E(18, 5.5, 3, 1.1)), line(E(6, 19, 3, 1.1)), line(E(18, 19, 3, 1.1)), accent(D(12, 12.25))]),
    icon('remote-control', 'Remote Control', ['remote', 'tv remote', 'controller', 'channel'], [body(R(8, 3, 8, 18, 3)), line(C(12, 7.8, 2)), line(D(10.5, 12.5)), line(D(13.5, 12.5)), line(D(10.5, 16)), accent(D(13.5, 16))]),
    icon('power-bank', 'Power Bank', ['portable charger', 'battery pack', 'charge', 'energy'], [body(R(6.5, 3, 11, 18, 2.5)), accent(poly([[12.8, 7], [10.5, 11.3], [13.5, 11.3], [11.2, 15.5]], 0.3)), line(L(10.5, 18.2, 13.5, 18.2))]),
    icon('graphics-card', 'Graphics Card', ['gpu', 'video card', 'hardware', 'rendering'], [body(R(3, 5.5, 18, 11, 1.5)), line(C(8.5, 11, 3)), line(C(15.5, 11, 3)), accent(D(8.5, 11)), line(D(15.5, 11)), line(L(6, 16.7, 6, 19)), line(L(8.5, 16.7, 8.5, 19)), line(L(11, 16.7, 11, 19)), line(L(13.5, 16.7, 13.5, 19))]),
  ],
};
