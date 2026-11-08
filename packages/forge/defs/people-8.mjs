import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'people',
  icons: [
    icon('hand-grab', 'Hand Grab', ['grab', 'fist', 'drag', 'hold', 'move'], [body('M7 11.5V9a1.5 1.5 0 0 1 3 0v-.5a1.5 1.5 0 0 1 3 0v.5a1.5 1.5 0 0 1 3 0v1a1.5 1.5 0 0 1 3 0v3.5c0 3.6-2.4 6-5.5 6-2.4 0-4-1.2-5.2-3L5 13.8a1.3 1.3 0 0 1 2-2.3Z'), line('M10 9v2.5M13 9v2.5M16 10v2')], { noAccent: true }),
  ],
};
