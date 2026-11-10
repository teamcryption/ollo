import { icon, body, line, accent } from '../src/dsl.mjs';
import { C, A } from '../src/geo.mjs';

export default {
  category: 'actions',
  icons: [
    icon('find-replace', 'Find and Replace', ['search replace', 'swap text', 'substitute', 'edit', 'find'], [body(C(9, 8.5, 5)), line('M12.6 12.1 13.8 13.3'), line('M14 16h6M18.5 14.5 20 16l-1.5 1.5'), line('M20 19.5h-6M15.5 18 14 19.5l1.5 1.5')], { noAccent: true }),
    icon('tap', 'Tap', ['touch', 'press', 'click', 'gesture', 'finger'], [body('M10 20.5l-3.2-4.3a1.4 1.4 0 0 1 2.1-1.8l1.6 1.6V9a1.5 1.5 0 0 1 3 0v4.5l3.6.7a2 2 0 0 1 1.6 2.2l-.5 4.1Z'), accent(A(12, 9, 4.5, 215, 325))]),
  ],
};
