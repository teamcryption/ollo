import { icon, body, accent } from '../src/dsl.mjs';

const FOLDER = 'M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z';

export default {
  category: 'files',
  icons: [
    icon('folder-image', 'Image Folder', ['photos folder', 'pictures', 'gallery', 'album', 'media folder'], [body(FOLDER), accent('M7 17l3-3.5 2.5 2.5 1.5-1.5 3 2.5')]),
  ],
};
