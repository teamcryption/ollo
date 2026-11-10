const N = `{ noAccent: true, containers: ['circle', 'square'] }`;
const L = (ch, d, o = N) => `icon('letter-${ch}', 'Letter ${ch.toUpperCase()}', ['${ch}', 'letter', 'alphabet', 'initial', 'character'], [${d}], ${o})`;
export default {
  text: [
    L('n', `line('M7 19.5v-15l10 15v-15')`),
    L('o', `line(E(12, 12, 6, 7.5))`, `{ noAccent: true }`),
    L('p', `line('M7.5 19.5v-15h5a4 4 0 0 1 0 8h-5')`),
    L('q', `line(E(12, 11.5, 6, 7)), line('M14 15.5l4 4.5')`),
    L('r', `line('M7.5 19.5v-15h5a4 4 0 0 1 0 8h-5m4.5 0 4.5 7')`),
    L('s', `line('M16.5 7c-.8-1.6-2.4-2.5-4.5-2.5-2.8 0-4.5 1.5-4.5 3.5s1.7 3 4.5 3.7 4.5 1.7 4.5 3.9-1.8 3.9-4.5 3.9c-2.3 0-4-1-4.8-2.6')`),
    L('t', `line('M5.5 4.5h13M12 4.5v15')`),
    L('u', `line('M7 4.5V14a5 5 0 0 0 10 0V4.5')`),
    L('v', `line('M6 4.5l6 15 6-15')`),
    L('w', `line('M4 4.5l3.5 15L12 8l4.5 11.5L20 4.5')`),
    L('x', `line('M6.5 4.5l11 15M17.5 4.5l-11 15')`),
    L('y', `line('M6 4.5l6 7.5 6-7.5M12 12v7.5')`),
    L('z', `line('M6.5 4.5h11l-11 15h11')`),
  ],
};
