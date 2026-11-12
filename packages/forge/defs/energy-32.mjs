import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('fuse-box-question', 'Fuse Box Help', ['help', 'question', 'support', 'fuse box', 'fuse-box'], [body(R(4, 3, 11, 15, 1.2)), line('M7 6.5v3M9.5 6.5v3M12 6.5v3M7 12v3M9.5 12v3M12 12v3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('fuse-box-calendar', 'Fuse Box Booking', ['booking', 'date', 'appointment', 'fuse box', 'fuse-box'], [body(R(4, 3, 11, 15, 1.2)), line('M7 6.5v3M9.5 6.5v3M12 6.5v3M7 12v3M9.5 12v3M12 12v3'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('fuse-box-sparkle', 'AI Fuse Box', ['ai', 'smart', 'magic', 'fuse box', 'fuse-box'], [body(R(4, 3, 11, 15, 1.2)), line('M7 6.5v3M9.5 6.5v3M12 6.5v3M7 12v3M9.5 12v3M12 12v3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
