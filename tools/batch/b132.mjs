const K = `{ noAccent: true }`;
export default {
  devices: [
    `icon('key-shift', 'Shift Key', ['shift', 'keyboard', 'uppercase', 'modifier', 'key'], [line('M12 4.5 4.5 12.5h4v7h7v-7h4Z')], ${K})`,
    `icon('key-capslock', 'Caps Lock', ['caps lock', 'keyboard', 'uppercase', 'modifier', 'key'], [line('M12 4 4.5 11.5h4V16h7v-4.5h4ZM8.5 19.5h7')], ${K})`,
    `icon('key-option', 'Option Key', ['alt', 'option', 'keyboard', 'modifier', 'key'], [line('M4 7h4.5l7 10H20M14 7h6')], ${K})`,
    `icon('key-space', 'Space Bar', ['space', 'spacebar', 'keyboard', 'blank', 'key'], [line('M4.5 12v4h15v-4')], ${K})`,
    `icon('eject', 'Eject', ['eject disc', 'remove', 'unmount', 'media', 'open tray'], [body(poly([[12, 5], [19, 13], [5, 13]], 1, true)), body(R(5, 16, 14, 2.5, 1.25))], ${K})`,
  ],
};
