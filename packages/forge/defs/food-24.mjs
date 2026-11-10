import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'food',
  icons: [
    icon('peanut', 'Peanut', ['nut', 'legume', 'allergy', 'snack', 'groundnut'], rot([body('M12 3.5a4.5 4.5 0 0 1 4.5 4.5c0 1.5-.8 2.5-1 4 .2 1.5 1 2.5 1 4a4.5 4.5 0 0 1-9 0c0-1.5.8-2.5 1-4-.2-1.5-1-2.5-1-4A4.5 4.5 0 0 1 12 3.5Z'), line(D(10.5, 7.5) + D(13.5, 9) + D(10.5, 15) + D(13.5, 16.5))], 35), { noAccent: true }),
    icon('bao', 'Bao Bun', ['steamed bun', 'dim sum', 'baozi', 'asian', 'dumpling'], [body('M3.5 16c0-5 3.8-9 8.5-9s8.5 4 8.5 9v.5a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 16.5Z'), line('M12 7.2v3M9.5 7.8l1.2 2.4M14.5 7.8l-1.2 2.4'), accent('M9.5 3v1.5M12 3v1.5M14.5 3v1.5')]),
    icon('salad', 'Salad', ['greens', 'healthy', 'lettuce', 'vegetables', 'bowl'], [body('M5 11.5c0-2 1.5-3.5 3.5-3.5.5-1.5 2-2.5 3.5-2.5s3 1 3.5 2.5c2 0 3.5 1.5 3.5 3.5Z'), body('M3.5 11.5h17c0 5-3.8 8.5-8.5 8.5S3.5 16.5 3.5 11.5Z', { cover: true })], { noAccent: true }),
    icon('soup', 'Soup', ['bowl', 'broth', 'hot meal', 'stew', 'spoon'], [line('M13 11 18 4.5'), body('M3.5 11.5h17c0 5-3.8 8.5-8.5 8.5S3.5 16.5 3.5 11.5Z', { cover: true }), accent('M7.5 4.5q-1 1.5 0 3M10.5 4q-1 1.5 0 3')]),
  ],
};
