import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, poly } from '../src/geo.mjs';

// Object on the left, arrow on the right: down = download, up = upload.
const DOWN = [line('M18 11v8'), line(poly([[15.5, 16.5], [18, 19], [20.5, 16.5]], 0.5))];
const UP = [line('M18 19v-8'), line(poly([[15.5, 13.5], [18, 11], [20.5, 13.5]], 0.5))];
const IMG = [body(R(3, 5, 11, 10, 2)), line('M5.2 12.5l2.4-2.4 2 2'), line(D(11, 8))];
const VID = [body(R(3, 5, 11, 10, 2)), line(poly([[7.5, 8], [10.5, 10], [7.5, 12]], 0.5, true))];
const NOTE = [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2))];

export default {
  category: 'files',
  icons: [
    icon('image-download', 'Image Download', ['save image', 'download photo', 'export picture', 'picture', 'save'], [...IMG, ...DOWN], { noAccent: true, variants: [{ name: 'image-upload', title: 'Image Upload', tags: ['upload photo', 'add picture', 'import image', 'picture', 'share'], els: [...IMG, ...UP] }] }),
    icon('video-download', 'Video Download', ['save video', 'download clip', 'offline video', 'movie', 'save'], [...VID, ...DOWN], { noAccent: true, variants: [{ name: 'video-upload', title: 'Video Upload', tags: ['upload video', 'publish clip', 'import video', 'movie', 'share'], els: [...VID, ...UP] }] }),
    icon('music-download', 'Music Download', ['save song', 'download track', 'offline music', 'audio', 'save'], [...NOTE, ...DOWN], { noAccent: true }),
    icon('app-download', 'App Download', ['install app', 'get app', 'mobile app', 'app store', 'install'], [body(R(3.5, 3, 9.5, 17, 2.5)), line('M7 5.5h2.5'), ...DOWN], { noAccent: true }),
  ],
};
