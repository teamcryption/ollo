import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, poly, star } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-id', 'AI Verification', ['identity ai', 'face match', 'kyc ai', 'verify', 'document check'], [body(R(3, 7, 14, 11, 2)), line(C(7.5, 11.5, 1.5)), line('M5.3 15.5a2.4 2.4 0 0 1 4.4 0M11.5 11h3.5'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-cube', 'AI 3D', ['text to 3d', 'generate model', '3d ai', 'mesh', 'object'], [body(poly([[9.5, 5], [16, 8.5], [16, 16], [9.5, 19.5], [3, 16], [3, 8.5]], 1, true)), line('M3.2 8.6 9.5 12l6.3-3.4M9.5 12v7.3'), spark(19.5, 5, 2)], { anim: 'pulse' }),
  ],
};
