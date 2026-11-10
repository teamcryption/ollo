import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, D, star } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-package', 'AI Logistics', ['smart shipping', 'route optimisation', 'ai delivery', 'supply chain', 'parcel'], [body(R(3, 6, 13.5, 13.5, 2)), line('M9.75 6.2v4'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-server', 'AI Server', ['inference', 'gpu server', 'model hosting', 'compute', 'data centre'], [body(R(3, 6, 13.5, 5.5, 1.5)), body(R(3, 13.5, 13.5, 5.5, 1.5)), line(D(6, 8.75) + D(6, 16.25)), spark(19.5, 4.5, 2)], { anim: 'pulse' }),
    icon('ai-laptop', 'AI PC', ['ai laptop', 'copilot pc', 'on device ai', 'smart computer', 'npu'], [body(R(4.5, 7, 12, 8.5, 1.5)), line('M3 18.5h15'), spark(19.5, 4.5, 2)], { anim: 'pulse' }),
  ],
};
