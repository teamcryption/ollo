import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, D, poly } from '../src/geo.mjs';

const pills = [9, 15].flatMap((x) => [7.5, 12, 16.5].map((y) => E(x, y, 2.2, 1.4))).join('');

export default {
  category: 'health',
  icons: [
    icon('blood-bag', 'Blood Bag', ['transfusion', 'blood donation', 'plasma', 'hospital', 'donor'], [line('M10 4V3h4v1'), body(R(6, 4, 12, 12.5, 3)), line('M12 16.5v4'), accent('M12 7c1.5 1.8 2.3 3 2.3 4a2.3 2.3 0 0 1-4.6 0c0-1 .8-2.2 2.3-4Z')]),
    icon('defibrillator', 'Defibrillator', ['aed', 'cardiac arrest', 'heart shock', 'emergency', 'first aid'], [line('M9 5V3.5h6V5'), body(R(3.5, 5, 17, 14.5, 2.5)), accent(poly([[13, 7.5], [9.5, 12.5], [12.5, 12.5], [11, 17], [14.5, 11.5], [11.5, 11.5]], 0.4, true))]),
    icon('scalpel', 'Scalpel', ['surgery', 'surgeon', 'blade', 'operation', 'incision'], [line('M4 20 12.5 11.5'), body('M12.5 11.5 18 6c1.5-1.5 3-1 2.5.5-.7 2.8-3.5 6-6 7.5Z')], { noAccent: true }),
    icon('glucose-meter', 'Glucose Meter', ['diabetes', 'blood sugar', 'glucometer', 'test', 'insulin'], [body(R(7.5, 3, 3, 3, 0.5)), body(R(3.5, 6, 11, 14.5, 2.5)), line(R(6, 8.5, 6, 4, 1)), line(D(9, 16.5)), accent('M18.5 6c1.2 1.4 1.8 2.4 1.8 3.3a1.8 1.8 0 0 1-3.6 0c0-.9.6-1.9 1.8-3.3Z')]),
    icon('hearing-aid', 'Hearing Aid', ['hearing', 'deaf', 'audiology', 'ear device', 'accessibility'], [body('M13 3.5c3.5 0 6 2.5 6 6s-2 6.5-5 7.5l-1.5-2.5c2-1 3.5-2.8 3.5-5s-1.5-3.5-3-3.5Z'), line('M13.5 17c-1 1.5-2.5 2.5-4.5 2.5'), body(C(7.5, 19, 1.6))], { noAccent: true }),
    icon('eye-chart', 'Eye Chart', ['snellen', 'vision test', 'optometry', 'eye exam', 'optician'], [body(R(5, 3, 14, 18, 1.5)), line('M9.5 7h5M10 10.5h4M10.5 14h3'), accent('M11 17.5h2')]),
    icon('blister-pack', 'Blister Pack', ['pills', 'tablets', 'medication', 'pharmacy', 'dose'], [body(R(4, 3.5, 16, 17, 2.5)), line(pills)], { noAccent: true }),
  ],
};
