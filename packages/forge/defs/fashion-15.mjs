import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('cowboy-hat', 'Cowboy Hat', ['stetson', 'western', 'rodeo', 'ranch', 'hat'], [body('M7.5 14.5C7 11 7.5 7 9.5 6.5c1 0 1.5 1 2.5 1s1.5-1 2.5-1c2 .5 2.5 4.5 2 8'), line('M7.4 12h9.2'), body('M3 13.5c2 2 5.5 2.5 9 2.5s7-.5 9-2.5c-1.5 3.5-5 4.5-9 4.5s-7.5-1-9-4.5Z', { cover: true })], { noAccent: true }),
  ],
};
