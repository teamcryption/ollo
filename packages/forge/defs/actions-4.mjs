import { icon, accent } from '../src/dsl.mjs';
import { CORNERS } from './security.mjs';

export default {
  category: 'actions',
  icons: [
    icon('select-all', 'Select All', ['select', 'all', 'mark all', 'choose all', 'selection'], [...CORNERS, accent('M8.5 12l2.5 2.5 4.5-5')]),
  ],
};
