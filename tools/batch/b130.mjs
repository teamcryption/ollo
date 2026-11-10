const N = `{ noAccent: true, containers: ['circle', 'square'] }`;
const L = (ch, d) => `icon('letter-${ch}', 'Letter ${ch.toUpperCase()}', ['${ch}', 'letter', 'alphabet', 'initial', 'character'], [line('${d}')], ${N})`;
export default {
  text: [
    L('a', 'M6.5 19.5 12 4.5l5.5 15M8.4 14.5h7.2'),
    L('b', 'M7.5 19.5v-15h5a3.6 3.6 0 0 1 0 7.2h-5m5 0a3.9 3.9 0 0 1 0 7.8h-5'),
    L('c', 'M17 7.2A6.5 7.5 0 1 0 17 16.8'),
    L('d', 'M7 4.5h4a6.5 7.5 0 0 1 0 15H7Z'),
    L('e', 'M16.5 4.5h-9v15h9M7.5 12h7'),
    L('f', 'M16.5 4.5h-9v15M7.5 12h7'),
    L('g', 'M17 7.2A6.5 7.5 0 1 0 18.5 12H13'),
    L('h', 'M7 4.5v15M17 4.5v15M7 12h10'),
    L('i', 'M12 4.5v15M9 4.5h6M9 19.5h6'),
    L('j', 'M15 4.5V15a4.5 4.5 0 0 1-9 0'),
    L('k', 'M7.5 4.5v15M17 4.5l-9.5 9M10.5 11l6.5 8.5'),
    L('l', 'M7.5 4.5v15h9'),
    L('m', 'M5.5 19.5v-15l6.5 9 6.5-9v15'),
  ],
};
