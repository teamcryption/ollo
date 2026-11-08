import { icon, body, line } from '../src/dsl.mjs';
import { R, L, rotateD } from '../src/geo.mjs';

const oar = (deg) => [line(rotateD(L(12, 3.5, 12, 14), deg)), body(rotateD(R(10, 13.5, 4, 7, 2), deg))];

export default {
  category: 'sports',
  icons: [
    icon('oars', 'Oars', ['rowing', 'paddle', 'boat', 'canoe', 'crew'], [...oar(40), ...oar(-40)], { noAccent: true }),
  ],
};
