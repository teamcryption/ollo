import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'communication',
  icons: [
    icon('letter', 'Letter', ['envelope letter', 'correspondence', 'note', 'invitation', 'post'], [line('M6.5 10V4.5h11V10'), accent(L(9.5, 7.2, 14.5, 7.2)), body(R(3.5, 10, 17, 10.5, 2)), line('M3.7 11 12 16l8.3-5')]),
  ],
};
