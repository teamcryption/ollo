import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-book', 'AI Book', ['ai reading', 'smart book', 'ebook ai', 'study assistant', 'knowledge'], [body(R(3.5, 6.5, 10, 14, 1.5)), line('M6.5 6.7v13.6'), spark(18, 6, 2.6)], { anim: 'pulse' }),
    icon('ai-graduation', 'AI Learning', ['ai education', 'tutor', 'learn', 'course', 'study'], [body(poly([[3.5, 10], [11, 6.5], [18.5, 10], [11, 13.5]], 0.8, true)), line('M6.5 11.5v3.5c1.5 1.5 3 2 4.5 2s3-.5 4.5-2v-3.5'), line('M17 10.7v4'), spark(19, 5.2, 2.2)], { anim: 'pulse' }),
    icon('ai-lock', 'AI Security', ['ai lock', 'secure ai', 'privacy ai', 'protected model', 'encryption'], [body(R(4, 11, 12, 9.5, 2.5)), line('M6.5 11V8a3.5 3.5 0 0 1 7 0v3'), line(D(10, 15.5)), spark(18.5, 6, 2.5)], { anim: 'pulse' }),
    icon('ai-pen', 'AI Pen', ['ai writing', 'smart pen', 'rewrite', 'edit with ai', 'draft'], [...rot([body(poly([[10, 3.5], [14, 3.5], [14, 16.5], [12, 20.5], [10, 16.5]], 0.8, true)), line('M10.2 6.5h3.6')], 45), spark(6, 6, 2.5)], { anim: 'pulse' }),
  ],
};
