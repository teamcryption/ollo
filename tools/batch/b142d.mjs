const Z = `{ noAccent: true }`;
const TRI = `body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true))`;
const DIA = `body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true))`;
const NO = (glyph) => `${glyph}, line('M6 6l12 12', { cover: true }), line(C(12, 12, 8.5))`;
export default {
  security: [
    `icon('high-voltage', 'High Voltage', ['electric hazard', 'danger', 'shock', 'warning sign', 'electricity'], [${TRI}, accent(poly([[12.8, 9.5], [10.3, 13.6], [12.5, 13.6], [11.5, 17], [14, 12.6], [11.8, 12.6]], 0.3, true))])`,
    `icon('hot-surface', 'Hot Surface', ['heat warning', 'burn hazard', 'caution', 'warning sign', 'hot'], [${TRI}, accent('M9.5 16.5c1-1.2 1-2.3 0-3.5s-1-2.3 0-3.5M12 16.5c1-1.2 1-2.3 0-3.5s-1-2.3 0-3.5M14.5 16.5c1-1.2 1-2.3 0-3.5s-1-2.3 0-3.5')])`,
  ],
  food: [
    `icon('no-drinks', 'No Drinks', ['no beverages', 'drinks prohibited', 'sign', 'ban', 'no cups'], [${NO(`body(poly([[9, 7], [15, 7], [14, 17], [10, 17]], 0.8, true))`)}], ${Z})`,
  ],
  commerce: [
    `icon('no-bags', 'No Bags', ['bags prohibited', 'leave bags', 'sign', 'ban', 'security'], [${NO(`line('M10.5 8.8V8a1.5 1.5 0 0 1 3 0v.8'), body(R(8, 9, 8, 7.5, 1.2))`)}], ${Z})`,
  ],
  transport: [
    `icon('curve-ahead', 'Curve Ahead', ['bend ahead', 'road sign', 'winding road', 'warning', 'driving'], [${DIA}, accent('M10.5 16.5v-3c0-2 1.3-3.2 3.5-3.2M12.5 8.5l1.8 1.8-1.8 1.8')])`,
    `icon('road-narrows', 'Road Narrows', ['narrow road', 'road sign', 'lane ends', 'warning', 'driving'], [${DIA}, accent('M9.5 8.5v2.5l1.5 1.5v3.5M14.5 8.5v2.5L13 12.5v3.5')])`,
    `icon('two-way-traffic', 'Two Way Traffic', ['two-way', 'road sign', 'oncoming traffic', 'warning', 'driving'], [${DIA}, accent('M10 16V9M8.5 10.5 10 9l1.5 1.5M14 8v7M12.5 13.5 14 15l1.5-1.5')])`,
    `icon('no-u-turn', 'No U-Turn', ['u-turn prohibited', 'road sign', 'traffic', 'ban', 'driving'], [${NO(`line('M10 17v-6a2.5 2.5 0 0 1 5 0v1.5M13.5 11l1.5 1.5 1.5-1.5')`)}], ${Z})`,
  ],
};
