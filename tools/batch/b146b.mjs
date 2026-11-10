const Z = `{ noAccent: true }`;
const CUR = `body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.75, 5, 4))`;
const M = {
  pin: `body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))`,
  heart: `body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })`,
  bolt: `body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })`,
  shield: `body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })`,
};
const T = (a) => a.map((t) => `'${t}'`).join(', ');
const cur = (m, name, title, tags) => `icon('${name}', '${title}', [${T(tags)}, 'cursor', 'pointer'], [${CUR}, ${M[m]}], ${Z})`;
const FIELD = `body(R(3, 8, 18, 8, 2.5))`;
export default {
  interface: [
    cur('pin', 'cursor-pin', 'Pick Location', ['drop pin', 'select place', 'map click']),
    cur('heart', 'cursor-heart', 'Like Click', ['tap to like', 'favourite', 'react']),
    cur('bolt', 'cursor-bolt', 'Quick Action', ['one click', 'instant', 'shortcut']),
    cur('shield', 'cursor-shield', 'Safe Click', ['secure click', 'verified link', 'safe browsing']),
    `icon('date-input', 'Date Input', ['date field', 'calendar', 'picker', 'form', 'ui'], [${FIELD}, line(R(5.5, 10, 4, 4, 0.8) + 'M5.6 11.4h3.8'), line('M12 12h5.5')], ${Z})`,
    `icon('location-input', 'Location Input', ['address field', 'place', 'picker', 'form', 'ui'], [${FIELD}, line('M7.5 14.5s-2-1.8-2-3.3a2 2 0 0 1 4 0c0 1.5-2 3.3-2 3.3Z'), line('M12 12h5.5')], ${Z})`,
  ],
};
