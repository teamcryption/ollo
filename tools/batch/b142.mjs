const Z = `{ noAccent: true }`;
export default {
  buildings: [
    `icon('bricks', 'Bricks', ['brick stack', 'masonry', 'building materials', 'construction', 'wall'], [body(R(3.5, 13, 8, 6.5, 1)), body(R(12.5, 13, 8, 6.5, 1)), body(R(8, 5.5, 8, 6.5, 1))], ${Z})`,
    `icon('cement-bag', 'Cement Bag', ['concrete', 'mortar', 'building materials', 'sack', 'construction'], [body('M6 4h12l1 2.5-1 2.5v9.5A1.5 1.5 0 0 1 16.5 20h-9A1.5 1.5 0 0 1 6 18.5V9L5 6.5Z'), line(R(8.5, 11, 7, 5, 0.8))], ${Z})`,
    `icon('i-beam', 'Steel Beam', ['girder', 'i-beam', 'steel', 'structure', 'construction'], [body('M5 4h14v3h-5v10h5v3H5v-3h5V7H5Z')], ${Z})`,
    `icon('portaloo', 'Portable Toilet', ['portaloo', 'site toilet', 'restroom', 'festival', 'construction site'], [line('M5 5.5h14'), body(R(6, 3.5, 12, 17, 2), { cover: true }), line(R(8.5, 8, 7, 12.3, 0.8)), line(D(14, 14))], ${Z})`,
  ],
  tools: [
    `icon('measuring-wheel', 'Measuring Wheel', ['surveyor wheel', 'distance', 'measure', 'construction', 'trundle wheel'], [body(C(8, 16, 4.5)), line(C(8, 16, 1.2)), line('M10.8 12.5 17 4.5M15.5 3.5h3')], ${Z})`,
    `icon('caution-tape', 'Caution Tape', ['barrier tape', 'warning', 'do not cross', 'hazard', 'construction'], [body(rotateD(R(3, 9.5, 18, 5, 1), -20)), line(rotateD('M7 9.7l-2 4.6M11 9.7l-2 4.6M15 9.7l-2 4.6M19 9.7l-2 4.6', -20))], ${Z})`,
    `icon('scissor-lift', 'Scissor Lift', ['aerial platform', 'lift', 'access platform', 'warehouse', 'construction'], [body(R(5, 3.5, 14, 3, 1)), line('M7 7.5l10 4M17 7.5l-10 4M7 11.5l10 4M17 11.5l-10 4'), body(R(4, 16.5, 16, 3, 1))], ${Z})`,
    `icon('saw-blade', 'Saw Blade', ['circular saw', 'blade', 'cutting', 'workshop', 'power tool'], [body(gear(12, 12, 8.5, 7.3, 16, 0.2)), line(C(12, 12, 2))], ${Z})`,
    `icon('sawhorse', 'Sawhorse', ['trestle', 'workshop', 'carpentry', 'support', 'diy'], [body(R(3.5, 7, 17, 3, 1)), line('M6 10l-2 10.5M9 10l1.5 10.5M18 10l2 10.5M15 10l-1.5 10.5')], ${Z})`,
    `icon('socket-wrench', 'Socket Wrench', ['ratchet', 'socket', 'mechanic', 'tighten', 'tools'], [line('M5 19 13.5 10.5'), body(C(16, 8, 3.8)), line(C(16, 8, 1.6))], ${Z})`,
    `icon('wing-nut', 'Wing Nut', ['nut', 'fastener', 'hardware', 'thumb nut', 'screw'], [body(poly([[3.5, 6], [9, 11.5], [9, 15], [4.5, 13.5]], 0.8, true)), body(poly([[20.5, 6], [15, 11.5], [15, 15], [19.5, 13.5]], 0.8, true)), body(C(12, 14, 3.5)), line(C(12, 14, 1.3))], ${Z})`,
  ],
};
