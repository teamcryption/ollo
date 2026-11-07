import { R, C, L, E, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const CROSS = poly([[9.5, 4], [14.5, 4], [14.5, 9.5], [20, 9.5], [20, 14.5], [14.5, 14.5], [14.5, 20], [9.5, 20], [9.5, 14.5], [4, 14.5], [4, 9.5], [9.5, 9.5]], 1, true);

export default {
  category: 'health',
  icons: [
    icon('medical-cross', 'Medical', ['health', 'hospital', 'first aid', 'clinic', 'care'], [body(CROSS)], { noAccent: true, anim: 'pulse', containers: ['circle', 'square'] }),
    icon('pill', 'Pill', ['medicine', 'capsule', 'drug', 'pharmacy', 'tablet'], [body(rotateD(R(3.5, 8.5, 17, 7, 3.5), -45)), line(rotateD(L(12, 8.7, 12, 15.3), -45))], { noAccent: true }),
    icon('stethoscope', 'Stethoscope', ['doctor', 'checkup', 'diagnosis', 'medical'], [line('M6 3.5H5a1 1 0 0 0-1 1V9a5 5 0 0 0 10 0V4.5a1 1 0 0 0-1-1h-1'), line('M9 14v1.5a5 5 0 0 0 10 0V13'), body(C(19, 10.8, 2))], { noAccent: true }),
    icon('syringe', 'Syringe', ['vaccine', 'injection', 'shot', 'needle', 'immunisation'], [body(rotateD(R(7, 9.5, 9, 5, 1), -45)), line(rotateD(L(16.2, 12, 19.5, 12), -45)), line(rotateD(L(19.5, 10, 19.5, 14), -45)), line(rotateD(L(3.5, 12, 6.8, 12), -45)), line(rotateD(L(10, 9.7, 10, 11.5), -45)), line(rotateD(L(13, 9.7, 13, 11.5), -45))], { noAccent: true }),
    icon('pulse', 'Pulse', ['heartbeat', 'vitals', 'ecg', 'health', 'activity'], [line(poly([[3, 12], [7, 12], [9, 8], [12, 16], [14, 12], [21, 12]], 0.5))], { noAccent: true }),
    icon('first-aid', 'First Aid Kit', ['emergency', 'medical kit', 'health', 'aid'], [body(R(3.5, 7, 17, 13, 2.5)), line('M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7'), accent('M12 11v5M9.5 13.5h5')]),
    icon('tooth', 'Tooth', ['dental', 'dentist', 'teeth', 'oral'], [body('M7.5 4c1.6 0 2.8.8 4.5.8S14.9 4 16.5 4c2.2 0 3.5 2 3.5 4.3 0 2.3-1 3.7-1.5 5.5-.6 2.4-1 6.2-2.6 6.2-1.6 0-1.5-4.5-3.9-4.5S9.7 20 8.1 20c-1.6 0-2-3.8-2.6-6.2C5 12 4 10.6 4 8.3 4 6 5.3 4 7.5 4Z'), accent('M7.5 8.5a1.5 1.5 0 0 1 1.5-1.5')]),
    icon('dna', 'DNA', ['genetics', 'biology', 'helix', 'science', 'gene'], [line('M8 3.5c0 5.5 8 6 8 8.5s-8 3-8 8.5'), line('M16 3.5c0 5.5-8 6-8 8.5s8 3 8 8.5'), line(L(9, 6, 15, 6)), line(L(9, 18, 15, 18))], { noAccent: true, anim: 'wiggle' }),
    icon('bandage', 'Bandage', ['plaster', 'injury', 'band-aid', 'wound'], [body(rotateD(R(3, 8.5, 18, 7, 3.5), -45)), line(rotateD(R(9.5, 9.7, 5, 4.6, 1), -45))], { noAccent: true }),
  ],
};
