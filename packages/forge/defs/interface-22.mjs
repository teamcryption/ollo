import { icon, body, line } from '../src/dsl.mjs';
import { R, C, E, gear, scaleD, translateD } from '../src/geo.mjs';

const HEART_PATH = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const HEART = [body(translateD(scaleD(HEART_PATH, 0.5), 5, 4.2), { cover: true })];
const LOCK = [line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })];
const SH = [body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })];
const GEAR = [body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))];
const GLOBE = [body(C(9.5, 9.5, 6.5)), line(E(9.5, 9.5, 2.7, 6.3)), line('M3.2 9.5h12.6')];
const PERSON = [body(C(9, 7.5, 3.3)), body('M3 18.5c.4-2.6 2.9-4.3 6-4.3 1.4 0 2.6.3 3.6.9-1 1-1.6 2.4-1.6 3.9v.5H3.8c-.5 0-.9-.5-.8-1Z')];

export default {
  category: 'interface',
  icons: [
    icon('user-heart', 'Follow', ['favourite contact', 'close friend', 'follow user', 'fan', 'social'], [...PERSON, ...HEART], { noAccent: true }),
    icon('music-heart', 'Liked Songs', ['loved track', 'favourite music', 'like song', 'playlist', 'audio'], [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2)), ...HEART], { noAccent: true }),
    icon('globe-lock', 'Geo-restricted', ['region locked', 'geo block', 'not available here', 'restricted', 'web'], [...GLOBE, ...LOCK], { noAccent: true }),
    icon('globe-shield', 'VPN', ['secure browsing', 'privacy network', 'global protection', 'encrypted web', 'security'], [...GLOBE, ...SH], { noAccent: true }),
    icon('globe-gear', 'Language and Region', ['locale settings', 'region settings', 'language', 'international', 'preferences'], [...GLOBE, ...GEAR], { noAccent: true }),
  ],
};
