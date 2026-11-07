import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'accessibility',
  icons: [
    icon('accessibility', 'Accessibility', ['a11y', 'universal access', 'inclusive', 'disability'], [body(C(12, 12, 9)), line(C(12, 7.3, 1.3)), line(L(7.5, 10.2, 16.5, 10.2)), line('M12 10.2v4l-2.5 4M12 14.2l2.5 4')], { noAccent: true }),
    icon('wheelchair', 'Wheelchair', ['disability', 'mobility', 'accessible', 'a11y'], [body(C(10, 4.8, 1.6)), line('M10 8v5h5l2 5.5'), line(L(10, 10.5, 14, 10.5)), line('M7.5 11.2A5 5 0 1 0 14.5 17.5')], { noAccent: true }),
    icon('ear', 'Hearing', ['ear', 'listen', 'hearing', 'audio', 'sound'], [line('M7 9a5 5 0 0 1 10 0c0 3.2-3.2 3.8-3.2 7a2.6 2.6 0 0 1-5.2.4'), accent('M10.5 10a1.5 1.5 0 0 1 3 0')], { off: true }),
    icon('braille', 'Braille', ['blind', 'tactile', 'reading', 'a11y'], [body(C(9, 6.5, 1.5)), body(C(9, 12, 1.5)), body(C(15, 12, 1.5)), body(C(15, 17.5, 1.5))], { noAccent: true }),
    icon('contrast', 'Contrast', ['high contrast', 'theme', 'brightness', 'display'], [line(C(12, 12, 8.5)), body('M12 3.5a8.5 8.5 0 0 1 0 17Z')], { noAccent: true }),
    icon('closed-captions', 'Captions', ['subtitles', 'cc', 'caption', 'video'], [body(R(3, 5.5, 18, 13, 2.5)), line('M10.5 10.2a2.3 2.3 0 1 0 0 3.6'), accent('M17 10.2a2.3 2.3 0 1 0 0 3.6')], { off: true }),
  ],
};
