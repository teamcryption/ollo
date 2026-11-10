const Z = `{ noAccent: true }`;
const TRI = `body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true))`;
const DIA = `body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true))`;
const NO = (glyph) => `${glyph}, line('M6 6l12 12', { cover: true }), line(C(12, 12, 8.5))`;
const tri = (name, title, tags, glyph) => `icon('${name}', '${title}', [${tags.map((t) => `'${t}'`).join(', ')}, 'warning sign', 'hazard'], [${TRI}, accent(${glyph})])`;
const dia = (name, title, tags, glyph) => `icon('${name}', '${title}', [${tags.map((t) => `'${t}'`).join(', ')}, 'road sign', 'driving'], [${DIA}, accent(${glyph})])`;
const no = (name, title, tags, glyph) => `icon('${name}', '${title}', [${tags.map((t) => `'${t}'`).join(', ')}, 'prohibited', 'sign'], [${NO(glyph)}], ${Z})`;
export default {
  security: [
    tri('laser-hazard', 'Laser Hazard', ['laser', 'radiation', 'beam'], `star(12, 14.5, 2.8, 1, 8, 0.1)`),
    tri('magnetic-field', 'Magnetic Field', ['magnet', 'mri', 'magnetism'], `'M10 16.5v-3a2 2 0 0 1 4 0v3'`),
    tri('cold-surface', 'Cold Surface', ['freezing', 'frostbite', 'cryogenic'], `'M12 11.5v6M9.4 13l5.2 3M14.6 13l-5.2 3'`),
    tri('deep-water', 'Deep Water', ['drowning', 'water', 'swimming'], `'M8.5 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0M8.5 17c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0'`),
    no('no-weapons', 'No Weapons', ['weapons prohibited', 'no knives', 'security'], `body(poly([[12, 6], [13.3, 8], [13.3, 14], [10.7, 14], [10.7, 8]], 0.5, true)), line('M9 15h6M12 15v3')`),
    no('no-entry', 'No Entry', ['do not enter', 'restricted', 'stop'], `body(R(7, 10.5, 10, 3, 1.5))`),
  ],
  transport: [
    no('no-left-turn', 'No Left Turn', ['left turn prohibited', 'traffic', 'road'], `line('M14 17v-4.5a2 2 0 0 0-2-2H8.5M10.5 8.5l-2 2 2 2')`),
    no('no-right-turn', 'No Right Turn', ['right turn prohibited', 'traffic', 'road'], `line('M10 17v-4.5a2 2 0 0 1 2-2h3.5M13.5 8.5l2 2-2 2')`),
    dia('signal-ahead', 'Signal Ahead', ['traffic light ahead', 'signals', 'intersection'], `'M10.5 8h3v8h-3ZM12 10h.01M12 12h.01M12 14h.01'`),
    dia('yield-ahead', 'Yield Ahead', ['give way ahead', 'yield', 'junction'], `poly([[9, 10], [15, 10], [12, 15]], 0.5, true)`),
    dia('bump-ahead', 'Bump Ahead', ['speed bump', 'hump', 'uneven road'], `'M8 15h2c.8-2.2 3.2-2.2 4 0h2'`),
    dia('low-clearance', 'Low Clearance', ['height limit', 'bridge', 'overhead'], `'M9 8.5h6M9 15.5h6M12 9.5v5M10.5 11l1.5-1.5 1.5 1.5M10.5 13l1.5 1.5 1.5-1.5'`),
    dia('divided-road', 'Divided Road', ['dual carriageway', 'median', 'highway'], `'M9.5 16V8M14.5 16V8'`),
  ],
  devices: [
    no('no-laptops', 'No Laptops', ['laptops prohibited', 'no computers', 'exam'], `body(R(8, 8, 8, 6, 1)), line('M6.5 16.5h11')`),
    no('no-flash', 'No Flash', ['flash photography prohibited', 'no flash', 'museum'], `body(poly([[13, 6.5], [9, 12.5], [12, 12.5], [11, 17.5], [15, 11], [12, 11]], 0.4, true))`),
  ],
  food: [
    no('no-alcohol', 'No Alcohol', ['alcohol prohibited', 'dry', 'no drinking'], `line('M9.5 7h5c0 3-1 4.5-2.5 4.5S9.5 10 9.5 7ZM12 11.5v5M10 16.5h4')`),
  ],
};
