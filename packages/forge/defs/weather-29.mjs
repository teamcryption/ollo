import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('snowflake-trash', 'Delete Snowflake', ['delete', 'remove', 'trash', 'snowflake', 'snowflake'], [line('M9.5 3.5v14M3.4 7l12.2 7M3.4 14l12.2-7'), line('M7.8 4.7l1.7 1.6 1.7-1.6M7.8 16.3l1.7-1.6 1.7 1.6'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('rainbow-trash', 'Delete Rainbow', ['delete', 'remove', 'trash', 'rainbow', 'rainbow'], [line('M3 15.5a6.5 6.5 0 0 1 13 0'), line('M5.5 15.5a4 4 0 0 1 8 0'), line('M8 15.5a1.5 1.5 0 0 1 3 0'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('sunrise-trash', 'Delete Sunrise', ['delete', 'remove', 'trash', 'sunrise', 'sunrise'], [line('M9.5 4v2M3.5 8.5l1.4 1M15.5 8.5l-1.4 1'), body('M4.5 13.5a5 5 0 0 1 10 0Z'), line('M2.5 16.5h14'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('wind-trash', 'Delete Wind', ['delete', 'remove', 'trash', 'wind', 'wind'], [line('M3 8h9a2.5 2.5 0 1 0-2.5-2.5M3 12h11.5a2.5 2.5 0 1 1-2.5 2.5M3 16h5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
  ],
};
