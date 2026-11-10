const Z = `{ noAccent: true }`;
const NO = (glyph) => `${glyph}, line('M6 6l12 12'), line(C(12, 12, 8.5))`;
const T = (a) => a.map((t) => `'${t}'`).join(', ');
const no = (name, title, tags, glyph) => `icon('${name}', '${title}', [${T(tags)}, 'prohibited', 'sign'], [${NO(glyph)}], ${Z})`;
export default {
  animals: [no('no-pets', 'No Pets', ['pets prohibited', 'no dogs', 'animals'], `body(C(12, 14, 2.6)), body(C(9, 10, 1.1)), body(C(12, 8.6, 1.1)), body(C(15, 10, 1.1))`)],
  sports: [
    no('no-cycling', 'No Cycling', ['bikes prohibited', 'bicycle', 'path'], `line(C(9, 14.5, 2.5) + C(15, 14.5, 2.5)), line('M9 14.5l2-4h3l1 4M11 10.5h-1')`),
    no('no-skateboards', 'No Skateboarding', ['skateboards prohibited', 'skate', 'plaza'], `line('M6.5 11.5c.3.6.8.9 1.5.9h8c.7 0 1.2-.3 1.5-.9'), line(D(9.5, 14.5) + D(14.5, 14.5))`),
  ],
  media: [no('no-music', 'No Music', ['music prohibited', 'quiet zone', 'silence'], `line('M13 15.5V8l2.5-.8'), body(C(11.5, 15.5, 1.6))`)],
  finance: [
    no('no-cash', 'No Cash', ['cashless', 'card only', 'payments'], `body(R(7, 9, 10, 6, 1)), line(C(12, 12, 1.4))`),
    no('no-cards', 'No Cards', ['cash only', 'cards not accepted', 'payments'], `body(R(7, 8.5, 10, 7, 1.2)), line('M7.2 11h9.6')`),
  ],
  weather: [no('no-umbrellas', 'No Umbrellas', ['umbrellas prohibited', 'stadium', 'venue'], `line('M7.5 12a4.5 4.5 0 0 1 9 0ZM12 12v4a1.2 1.2 0 0 0 2.4 0')`)],
  nature: [no('no-littering', 'No Littering', ['do not litter', 'keep clean', 'rubbish'], `line('M9 9h6M9.8 9l.6 7.5h3.2l.6-7.5M11 9V8h2v1')`)],
  food: [
    no('no-cooking', 'No Cooking', ['cooking prohibited', 'no stoves', 'kitchen'], `body(C(10.5, 12.5, 3)), line('M13.5 12.5H18')`),
    no('no-food', 'No Food', ['no eating', 'food prohibited', 'snacks'], `line('M9.5 7.5v9M8.3 7.5v3a1.2 1.2 0 0 0 2.4 0v-3M14.5 7.5c-1 0-1.5 1.5-1.5 3.5h1.5v5.5')`),
  ],
};
