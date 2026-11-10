import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'devices',
  icons: [
    icon('usb-hub', 'USB Hub', ['ports', 'adapter', 'splitter', 'usb', 'connector'], [body(R(3.5, 9, 13, 6, 2)), line(R(5.5, 11, 2, 2, 0.4) + R(9, 11, 2, 2, 0.4) + R(12.5, 11, 2, 2, 0.4)), line('M16.5 12h2a2 2 0 0 1 2 2v6.5')], { noAccent: true }),
    icon('barcode-scanner', 'Barcode Scanner', ['scanner gun', 'checkout', 'inventory', 'pos', 'scan'], [body('M12.5 4H19a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 19 11h-3l1.5 9.5h-4L12 11h.5a3.5 3.5 0 0 1 0-7Z'), accent('M3.5 5l3 1.5M3.5 10l3-1.5')]),
    icon('receipt-printer', 'Receipt Printer', ['pos printer', 'thermal printer', 'checkout', 'till', 'receipt'], [body('M7.5 11V4l1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1V11Z'), line('M9.5 7.5h5'), body(R(4, 10, 16, 10, 2.5), { cover: true }), line('M7 14h10'), line(D(16.5, 17))], { noAccent: true }),
    icon('dashcam', 'Dashcam', ['dash camera', 'car camera', 'recording', 'driving', 'windshield'], [body(R(3.5, 8, 13, 8.5, 2)), line(C(9, 12.25, 2.3)), line('M13.5 10.5h.5'), line('M16.5 10.5h2.5V3.5')], { noAccent: true }),
    icon('action-camera', 'Action Camera', ['sports camera', 'helmet cam', 'adventure', 'video', 'waterproof'], [body(R(4, 6, 16, 12, 3)), line(C(10, 12, 3)), line(R(15, 8.5, 2.5, 2, 0.5)), line('M10 18v2.5M14 18v2.5')], { noAccent: true }),
  ],
};
