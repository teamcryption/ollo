import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, poly, rotateD } from '../src/geo.mjs';

const BLADE = 'M12 10.5c-1-3.5.5-6 3.5-6.3.8 3-.6 5.6-3.5 6.3Z';
const blades = [0, 120, 240].map((a) => body(rotateD(BLADE, a, 12, 12)));

export default {
  category: 'devices',
  icons: [
    icon('ssd', 'SSD', ['m.2', 'solid state drive', 'storage', 'nvme', 'hardware'], [body(R(3, 8, 18, 8, 1)), line(R(5.5, 10, 4, 4, 0.8)), line(R(11, 10, 4, 4, 0.8)), accent(L18())]),
    icon('cooling-fan', 'Cooling Fan', ['pc fan', 'cpu fan', 'ventilation', 'cooler', 'hardware'], [line(R(3.5, 3.5, 17, 17, 3)), ...blades, body(C(12, 12, 1.6))], { noAccent: true, anim: 'spin' }),
    icon('doorbell-camera', 'Video Doorbell', ['doorbell', 'smart doorbell', 'door camera', 'security', 'smart home'], [body(R(8, 3, 8, 18, 4)), line(C(12, 8, 1.8)), accent(C(12, 16, 1.6))]),
    icon('rotary-phone', 'Rotary Phone', ['telephone', 'landline', 'vintage phone', 'retro', 'dial'], [body('M3.5 10a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v.5h-3.5v-1h-10v1H3.5Z'), body(poly([[6, 11.5], [18, 11.5], [20, 20], [4, 20]], 1.5, true)), line(C(12, 15.7, 2.3))], { noAccent: true }),
  ],
};

function L18() { return 'M18.5 10.5v3'; }
