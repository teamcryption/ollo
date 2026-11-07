import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const spikes = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  return line(L(12 + 5.8 * Math.cos(a), 12 + 5.8 * Math.sin(a), 12 + 8 * Math.cos(a), 12 + 8 * Math.sin(a)));
});

export default {
  category: 'health',
  icons: [
    icon('ambulance', 'Ambulance', ['emergency', 'paramedic', 'hospital', 'rescue', '911'], [body(R(3, 6.5, 11, 11, 1.5)), body('M14 9.5h3.5l3 3.5v4.5H14Z'), body(C(7, 18.5, 1.8), { cover: true }), body(C(17, 18.5, 1.8), { cover: true }), accent('M8.5 9.5v5M6 12h5')], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('face-mask', 'Face Mask', ['mask', 'medical mask', 'covid', 'protection', 'hygiene'], [line('M6 9.5H4.5A1.5 1.5 0 0 0 3 11v2a1.5 1.5 0 0 0 1.5 1.5H6'), line('M18 9.5h1.5A1.5 1.5 0 0 1 21 11v2a1.5 1.5 0 0 1-1.5 1.5H18'), body(R(6, 7, 12, 10, 3)), line(L(8.5, 10, 15.5, 10)), accent(L(8.5, 13.8, 15.5, 13.8))]),
    icon('virus', 'Virus', ['germ', 'bacteria', 'infection', 'pathogen', 'covid'], [body(C(12, 12, 5.5)), ...spikes, accent(D(12, 12))], { anim: 'spin' }),
    icon('pill-bottle', 'Pill Bottle', ['medication', 'prescription', 'pharmacy', 'medicine'], [body(R(6, 3, 12, 4, 1.2)), body(R(7, 7.5, 10, 13, 2)), accent('M12 11.5V16M9.75 13.75h4.5')]),
    icon('blood-drop', 'Blood Donation', ['blood', 'donate', 'transfusion', 'blood type'], [body('M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5Z'), accent('M12 11.5v5M9.5 14h5')]),
    icon('hospital-bed', 'Hospital Bed', ['ward', 'patient', 'inpatient', 'clinic', 'admitted'], [line(L(3.5, 5, 3.5, 20.5)), body(R(3.5, 11.5, 17, 4, 1)), line(L(20.5, 15.5, 20.5, 20.5)), accent(C(8, 7.5, 1.8))]),
    icon('bathroom-scale', 'Weight Scale', ['weight', 'bmi', 'fitness', 'body', 'diet'], [body(R(3.5, 3.5, 17, 17, 4)), line(R(8, 6.5, 8, 4, 1.5)), accent(D(12, 8.5))]),
  ],
};
