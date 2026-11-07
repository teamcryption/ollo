import { icon, body, line, accent } from '../src/dsl.mjs';
import { PAGE, FOLD } from './files.mjs';

export default {
  category: 'files',
  icons: [
    icon('file-heart', 'Favourite File', ['liked document', 'saved file', 'love', 'favourite'], [body(PAGE), line(FOLD), accent('M12 17.5c-2.2-1.4-3.3-2.6-3.3-3.9a1.65 1.65 0 0 1 3.3-.7 1.65 1.65 0 0 1 3.3.7c0 1.3-1.1 2.5-3.3 3.9Z')]),
    icon('file-user', 'User File', ['profile document', 'cv', 'resume', 'personal file', 'record'], [body(PAGE), line(FOLD), accent('M12 10.3a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6ZM8.8 18.3a3.2 3.2 0 0 1 6.4 0')]),
  ],
};
