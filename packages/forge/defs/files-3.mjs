import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { PAGE, FOLD } from './files.mjs';

const FOLDER = 'M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z';

export default {
  category: 'files',
  icons: [
    icon('file-signature', 'Signed Document', ['sign', 'contract', 'agreement', 'e-signature'], [body(PAGE), line(FOLD), line(L(8.5, 11.5, 15.5, 11.5)), accent('M8.5 16.5c1-1.3 1.8-1.3 2.2 0s1.2 1.3 2.2 0 1.5-1 2.4 0')]),
    icon('file-json', 'JSON File', ['json', 'data', 'config', 'object', 'api'], [body(PAGE), line(FOLD), line('M10.3 11h-.5a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1h.5'), line('M13.7 11h.5a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1 1 1 0 0 0-1 1v1a1 1 0 0 1-1 1h-.5'), accent(D(12, 14))]),
    icon('file-presentation', 'Presentation File', ['slides', 'deck', 'ppt', 'keynote'], [body(PAGE), line(FOLD), line(R(8, 10.5, 8, 6, 1)), accent(D(12, 13.5))]),
    icon('folder-shared', 'Shared Folder', ['shared', 'team folder', 'collaborate', 'access'], [body(FOLDER), accent(C(12, 11.3, 1.6)), line('M9 17.8a3 3 0 0 1 6 0')], { badges: ['add', 'check'] }),
    icon('file-clock', 'Recent File', ['recent', 'history', 'pending', 'scheduled'], [body(PAGE), line(FOLD), body(C(16.5, 16.5, 4.5), { cover: true }), accent(poly([[16.5, 14.5], [16.5, 16.5], [18, 17.5]], 0.4))]),
  ],
};
