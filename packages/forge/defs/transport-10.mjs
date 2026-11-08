import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('yacht', 'Yacht', ['motor yacht', 'boat', 'cruise', 'luxury', 'marina'], [line('M9.3 11 10.5 7.5h4l1.8 3.5'), body('M6.5 15 8 11h8.5l2 4Z'), body('M3 15h18l-2.5 4.5h-13Z', { cover: true })], { noAccent: true }),
  ],
};
