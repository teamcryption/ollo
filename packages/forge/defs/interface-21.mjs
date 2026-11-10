import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, poly, gear, scaleD, translateD } from '../src/geo.mjs';

const GEAR = [body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))];
const BOLT = [body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];
const PIN = [body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))];
const DOWN = [line('M18 11v8'), line(poly([[15.5, 16.5], [18, 19], [20.5, 16.5]], 0.5))];
const UP = [line('M18 19v-8'), line(poly([[15.5, 13.5], [18, 11], [20.5, 13.5]], 0.5))];
const HEART_PATH = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const HEART = [body(translateD(scaleD(HEART_PATH, 0.5), 5, 4.2), { cover: true })];
const NOTE = [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2))];
const IMG = [body(R(3, 4, 14, 11.5, 2)), line('M5.5 12.5l2.8-2.8 2.2 2.2'), line(D(13, 7.5))];
const VID = [body(R(3, 4, 14, 11.5, 2)), line(poly([[8, 7.2], [11.5, 9.7], [8, 12.2]], 0.5, true))];
const PINMAP = [body('M9.5 18.5s-6-5.2-6-9.6a6 6 0 0 1 12 0c0 1.1-.4 2.3-1 3.4'), line(C(9.5, 8.9, 2))];
const BARS = [body(R(3, 11, 3, 7, 1)), body(R(7.5, 7, 3, 11, 1)), body(R(12, 4, 3, 6.5, 1))];
const SERVER = [body(R(3, 4, 13, 5.5, 1.5)), body(R(3, 11, 13, 5.5, 1.5)), line(D(6, 6.75) + D(6, 13.75))];
const LAPTOP = [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10')];
const TICKET = [body('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V9a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 13.5V12a1.5 1.5 0 0 0 0-3Z'), line('M11 6.5v1.5M11 10v1M11 13v1.5')];

export default {
  category: 'interface',
  icons: [
    icon('music-gear', 'Audio Settings', ['sound settings', 'equaliser', 'playback', 'audio', 'preferences'], [...NOTE, ...GEAR], { noAccent: true }),
    icon('image-gear', 'Photo Settings', ['image settings', 'edit photo', 'adjust image', 'camera settings', 'preferences'], [...IMG, ...GEAR], { noAccent: true }),
    icon('location-gear', 'Location Settings', ['location services', 'gps settings', 'permissions', 'privacy', 'preferences'], [...PINMAP, ...GEAR], { noAccent: true }),
    icon('chart-gear', 'Analytics Settings', ['report settings', 'dashboard config', 'metrics setup', 'analytics', 'preferences'], [...BARS, ...GEAR], { noAccent: true }),
    icon('chart-bolt', 'Real-time Analytics', ['live data', 'streaming metrics', 'instant insights', 'performance', 'analytics'], [...BARS, ...BOLT], { noAccent: true }),
    icon('smartphone-bolt', 'Fast Charging', ['phone charging', 'quick charge', 'battery boost', 'power', 'mobile'], [body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5'), ...BOLT], { noAccent: true }),
    icon('laptop-bolt', 'Laptop Charging', ['charging', 'power adapter', 'battery', 'plugged in', 'computer'], [...LAPTOP, ...BOLT], { noAccent: true }),
    icon('cart-bolt', 'Buy Now', ['one click buy', 'instant checkout', 'quick purchase', 'express checkout', 'shopping'], [line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5)), ...BOLT], { noAccent: true }),
    icon('ticket-clock', 'Event Time', ['showtime', 'start time', 'doors open', 'schedule', 'event'], [...TICKET, ...CLOCK], { noAccent: true }),
    icon('server-pin', 'Server Region', ['data centre location', 'hosting region', 'edge location', 'availability zone', 'infrastructure'], [...SERVER, ...PIN], { noAccent: true }),
    icon('cloud-pin', 'Cloud Region', ['region', 'data residency', 'cloud location', 'zone', 'hosting'], [body('M6.5 15a3.5 3.5 0 0 1-.4-7 5 5 0 0 1 9.6 1.1A3 3 0 0 1 15.5 15Z'), ...PIN], { noAccent: true }),
    icon('browser-download', 'Downloads', ['download list', 'saved files', 'browser downloads', 'transfers', 'files'], [body(R(3, 4, 13, 12, 2)), line('M3.2 7.5h12.6'), ...DOWN], { noAccent: true }),
    icon('laptop-download', 'Desktop App', ['download app', 'install software', 'desktop download', 'installer', 'computer'], [body(R(3, 5, 11, 8.5, 1.5)), line('M3 16h11'), ...DOWN], { noAccent: true }),
    icon('server-upload', 'Deploy', ['upload to server', 'publish', 'release', 'ship', 'hosting'], [...SERVER.slice(0, 2), line(D(6, 6.75) + D(6, 13.75)), ...UP], { noAccent: true, variants: [{ name: 'server-download', title: 'Fetch from Server', tags: ['download from server', 'pull', 'sync down', 'retrieve', 'hosting'], els: [...SERVER, ...DOWN] }] }),
    icon('image-heart', 'Liked Photo', ['favourite photo', 'loved image', 'like', 'gallery', 'social'], [...IMG, ...HEART], { noAccent: true }),
    icon('video-heart', 'Liked Video', ['favourite video', 'loved clip', 'like', 'watch', 'social'], [...VID, ...HEART], { noAccent: true }),
    icon('location-heart', 'Favourite Place', ['loved place', 'date spot', 'favourite location', 'map', 'saved'], [...PINMAP, ...HEART], { noAccent: true }),
  ],
};
