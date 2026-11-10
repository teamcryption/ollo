import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'development',
  icons: [
    icon('code-comment', 'Code Review', ['code comment', 'review', 'pull request comment', 'feedback', 'discussion'], [body('M6 4h12a3 3 0 0 1 3 3v7.5a3 3 0 0 1-3 3h-6.5L7 21v-3.5H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z'), line('M9.8 8.5 7.5 10.75 9.8 13M14.2 8.5l2.3 2.25-2.3 2.25')], { noAccent: true }),
  ],
};
