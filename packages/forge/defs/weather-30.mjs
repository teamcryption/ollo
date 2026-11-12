import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('snowflake-flag', 'Report Snowflake', ['report', 'flag', 'mark', 'snowflake', 'snowflake'], [line('M9.5 3.5v14M3.4 7l12.2 7M3.4 14l12.2-7'), line('M7.8 4.7l1.7 1.6 1.7-1.6M7.8 16.3l1.7-1.6 1.7 1.6'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('sunrise-flag', 'Report Sunrise', ['report', 'flag', 'mark', 'sunrise', 'sunrise'], [line('M9.5 4v2M3.5 8.5l1.4 1M15.5 8.5l-1.4 1'), body('M4.5 13.5a5 5 0 0 1 10 0Z'), line('M2.5 16.5h14'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('wind-flag', 'Report Wind', ['report', 'flag', 'mark', 'wind', 'wind'], [line('M3 8h9a2.5 2.5 0 1 0-2.5-2.5M3 12h11.5a2.5 2.5 0 1 1-2.5 2.5M3 16h5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
