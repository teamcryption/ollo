import { R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'design',
  icons: [
    icon('bring-to-front', 'Bring to Front', ['arrange', 'order', 'layer up', 'front', 'z-index'], [line('M16 10h2.5a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V16'), body(R(3.5, 3.5, 10.5, 10.5, 2))], { noAccent: true }),
  ],
};
