const Z = `{ noAccent: true }`;
const DIA = `body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true))`;
const NO = (glyph) => `${glyph}, line('M6 6l12 12', { cover: true }), line(C(12, 12, 8.5))`;
const FLAME = 'M12 16.5c-1.8 0-3-1.2-3-2.8 0-1.5 1-2.3 1.6-3.5.4 1 1 1.4 1.5 1.5.2-1.5.9-2.6 2-3.5.3 1.6 1.9 2.7 1.9 4.6 0 2.1-1.4 3.7-4 3.7Z';
const T = (a) => a.map((t) => `'${t}'`).join(', ');
const dia = (name, title, tags, d) => `icon('${name}', '${title}', [${T(tags)}, 'road sign', 'driving'], [${DIA}, accent(scaleD('${d}', 0.85, 12, 12))])`;
const no = (name, title, tags, glyph) => `icon('${name}', '${title}', [${T(tags)}, 'prohibited', 'sign'], [${NO(glyph)}], ${Z})`;
export default {
  sports: [
    no('no-fishing', 'No Fishing', ['fishing prohibited', 'angling', 'lake'], `line('M13.5 7v6.5a2.5 2.5 0 0 1-5 0v-1l1.5 1')`),
    no('no-ball-games', 'No Ball Games', ['ball games prohibited', 'park', 'play'], `body(C(12, 12, 4)), line('M8.3 11.2c2.5 1 5 1 7.4 0')`),
  ],
  travel: [
    no('no-camping', 'No Camping', ['camping prohibited', 'tent', 'park'], `line('M7.5 16.5 12 8l4.5 8.5ZM12 16.5v-3')`),
    no('no-fires', 'No Open Fires', ['fires prohibited', 'no campfire', 'flame'], `body(scaleD('${FLAME}', 0.9, 12, 12))`),
  ],
  media: [
    no('no-headphones', 'No Headphones', ['headphones prohibited', 'audio', 'quiet'], `line('M8 14v-2a4 4 0 0 1 8 0v2'), body(R(7, 13.5, 2.5, 4, 1)), body(R(14.5, 13.5, 2.5, 4, 1))`),
    no('no-photos', 'No Photos', ['photography prohibited', 'camera', 'museum'], `body('M7.5 9.5h2l1-1.5h3l1 1.5h2v6.5h-9Z'), line(C(12, 12.7, 1.6))`),
  ],
  commerce: [
    no('no-carts', 'No Trolleys', ['carts prohibited', 'shopping trolley', 'store'], `line('M7 8h1.3l1.3 6h5.2l1-4.2H8.6'), line(D(10, 16.5) + D(14, 16.5))`),
  ],
  transport: [
    dia('crossroad-ahead', 'Crossroad Ahead', ['intersection', 'junction', 'crossroads'], 'M12 8v8M8 12h8'),
    dia('side-road', 'Side Road', ['junction', 'side street', 'turn off'], 'M11 16V8M11 12h4'),
    dia('y-junction', 'Y Junction', ['fork in road', 'junction', 'split'], 'M12 16v-4M12 12 9 8.5M12 12l3-3.5'),
    dia('winding-road', 'Winding Road', ['bends', 'curvy road', 'zigzag'], 'M10.5 16c0-2 3-2 3-4s-3-2-3-4'),
  ],
};
