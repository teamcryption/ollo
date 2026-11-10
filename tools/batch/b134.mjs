const Z = `{ noAccent: true }`;
export default {
  science: [
    `icon('black-hole', 'Black Hole', ['space', 'singularity', 'astronomy', 'gravity', 'cosmos'], [line('M12 4.5c4 0 7.5 3.4 7.5 7.5M12 19.5c-4 0-7.5-3.4-7.5-7.5M4.5 9c1.4-2.5 4-4 7-4M19.5 15c-1.4 2.5-4 4-7 4'), body(C(12, 12, 2.8))], ${Z})`,
    `icon('space-helmet', 'Space Helmet', ['astronaut', 'spacesuit', 'cosmonaut', 'space', 'explorer'], [body(C(12, 10.5, 7)), line(R(7.5, 8, 9, 5, 2.5)), body(R(7, 18, 10, 2.5, 1.25))], ${Z})`,
  ],
  celebration: [
    `icon('stocking', 'Christmas Stocking', ['christmas', 'stocking', 'gifts', 'holiday', 'fireplace'], [body('M8 3.5h7v9.5l-4.5 5.5c-1.3 1.6-3.8 1.8-5.3.4s-1.5-3.7-.1-5.2L8 10Z'), line('M8.2 7h6.6')], ${Z})`,
  ],
  food: [
    `icon('fortune-cookie', 'Fortune Cookie', ['fortune', 'chinese food', 'luck', 'dessert', 'message'], [body('M3.5 13c0-4 3.8-7 8.5-7s8.5 3 8.5 7c-2 0-3.8.8-5 2.2L12 18.5l-3.5-3.3C7.3 13.8 5.5 13 3.5 13Z'), line('M14.5 16l4 3')], ${Z})`,
    `icon('ice-cube', 'Ice Cubes', ['ice', 'cold drink', 'frozen', 'chill', 'cubes'], [body(rotateD(R(3.5, 9, 10, 10, 2.5), -12, 8.5, 14)), body(rotateD(R(11, 4, 9.5, 9.5, 2.5), 10, 15.75, 8.75), { cover: true })], ${Z})`,
  ],
  buildings: [
    `icon('greek-column', 'Column', ['pillar', 'greek', 'classical', 'museum', 'architecture'], [body(R(5, 4, 14, 3, 1)), line('M7.5 7v10M10.5 7v10M13.5 7v10M16.5 7v10'), body(R(5, 17, 14, 3, 1))], ${Z})`,
    `icon('dome', 'Dome', ['capitol', 'observatory', 'mosque dome', 'architecture', 'cupola'], [line('M12 9.5V4.5M3.5 20.5h17'), body('M4 18.5c0-5 3.6-9 8-9s8 4 8 9Z')], ${Z})`,
  ],
  home: [
    `icon('urn', 'Urn', ['vase', 'amphora', 'pottery', 'decor', 'antique'], [body(R(9.5, 3.5, 5, 2, 1)), body('M9 6.5h6l-.5 2.5c2 1.3 3 3.3 3 5.5 0 3-2 5.5-5.5 5.5s-5.5-2.5-5.5-5.5c0-2.2 1-4.2 3-5.5Z'), line('M7.5 10.5c-1.5 0-2.5 1-2.5 2.5M16.5 10.5c1.5 0 2.5 1 2.5 2.5')], ${Z})`,
    `icon('bookend', 'Bookend', ['books', 'shelf', 'library', 'reading', 'organiser'], [body(poly([[13, 5], [16, 5], [16, 17.5], [20, 17.5], [20, 20.5], [13, 20.5]], 0.8, true)), body(R(4.5, 8, 3, 12.5, 0.6)), body(R(8.5, 10, 3, 10.5, 0.6))], ${Z})`,
  ],
  tools: [
    `icon('chainsaw', 'Chainsaw', ['saw', 'lumber', 'cutting', 'forestry', 'power tool'], [line('M5 9V7.5h5V9'), body(R(3.5, 9, 9, 7, 2)), body(R(13.7, 10.5, 7, 4, 2))], ${Z})`,
  ],
  devices: [
    `icon('typewriter', 'Typewriter', ['writing', 'vintage', 'author', 'keys', 'retro'], [line('M7.5 11V4.5h9V11'), body(R(4, 11, 16, 8.5, 2)), line(D(8, 15) + D(10.7, 15) + D(13.3, 15) + D(16, 15))], ${Z})`,
  ],
  media: [
    `icon('gramophone', 'Gramophone', ['phonograph', 'vintage music', 'record player', 'retro', 'horn'], [body(R(4, 14, 10, 6, 1.2)), line('M9 14v-2.5l2-2'), body(poly([[10.5, 9.5], [17.5, 3.5], [20.5, 10.5]], 1.2, true))], ${Z})`,
  ],
  security: [
    `icon('dagger', 'Dagger', ['knife', 'blade', 'weapon', 'medieval', 'fantasy'], [body(poly([[12, 3.5], [13.8, 6], [13.8, 14], [10.2, 14], [10.2, 6]], 0.6, true)), body(R(7.5, 14.5, 9, 2, 1)), line('M12 16.5v4')], ${Z})`,
  ],
};
