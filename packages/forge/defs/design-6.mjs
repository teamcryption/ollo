import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'design',
  icons: [
    icon('blueprint', 'Blueprint', ['floor plan', 'architecture', 'drawing', 'plan', 'technical'], [body(R(5.5, 4, 15, 16, 1.5)), body(R(3, 3, 4.5, 15.5, 2.25), { cover: true }), line('M10.5 8.5h6.5v7.5h-3M10.5 8.5V16h1.5')], { noAccent: true }),
  ],
};
