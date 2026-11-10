import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

const LOCK = [line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })];
const SH = body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true });
const VID = [body(R(3, 4, 14, 11.5, 2)), line(poly([[8, 7.2], [11.5, 9.7], [8, 12.2]], 0.5, true))];

export default {
  category: 'security',
  icons: [
    icon('video-lock', 'Private Video', ['locked video', 'members only', 'paywalled', 'private', 'secure'], [...VID, ...LOCK], { noAccent: true }),
    icon('laptop-lock', 'Laptop Locked', ['lock screen', 'device lock', 'secure laptop', 'private', 'locked'], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10'), ...LOCK], { noAccent: true }),
    icon('location-shield', 'Safe Zone', ['geofence', 'safe location', 'location privacy', 'protected area', 'secure'], [body('M9.5 18.5s-6-5.2-6-9.6a6 6 0 0 1 12 0c0 1.1-.4 2.3-1 3.4'), line(C(9.5, 8.9, 2)), SH], { noAccent: true }),
    icon('video-shield', 'Content Protection', ['drm', 'copyright', 'protected video', 'secure stream', 'safe'], [...VID, SH], { noAccent: true }),
  ],
};
