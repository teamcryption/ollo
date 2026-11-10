const Z = `{ noAccent: true }`;
const DIA = `body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true))`;
const FLAME = 'M12 16.5c-1.8 0-3-1.2-3-2.8 0-1.5 1-2.3 1.6-3.5.4 1 1 1.4 1.5 1.5.2-1.5.9-2.6 2-3.5.3 1.6 1.9 2.7 1.9 4.6 0 2.1-1.4 3.7-4 3.7Z';
const NO = (glyph) => `${glyph}, line('M6 6l12 12', { cover: true }), line(C(12, 12, 8.5))`;
export default {
  science: [
    `icon('oxidizer', 'Oxidizer', ['oxidising', 'ghs', 'hazard', 'flame over circle', 'safety sign'], [${DIA}, accent(C(12, 15, 1.8) + scaleD('${FLAME}', 0.5, 12, 8))])`,
    `icon('corrosive', 'Corrosive', ['acid', 'ghs', 'hazard', 'chemical burn', 'safety sign'], [${DIA}, accent('M9.5 9s-1.5 1.7-1.5 2.7a1.5 1.5 0 0 0 3 0c0-1-1.5-2.7-1.5-2.7ZM14.5 9s-1.5 1.7-1.5 2.7a1.5 1.5 0 0 0 3 0c0-1-1.5-2.7-1.5-2.7ZM9 15.5h6')])`,
    `icon('gas-pressure', 'Compressed Gas', ['gas cylinder', 'ghs', 'pressure', 'hazard', 'safety sign'], [${DIA}, accent(R(10, 8.5, 4, 7.5, 2))])`,
    `icon('health-hazard', 'Health Hazard', ['ghs', 'carcinogen', 'hazard', 'danger to health', 'safety sign'], [${DIA}, accent('M12 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9.5 16c0-1.8 1.1-3 2.5-3s2.5 1.2 2.5 3')])`,
    `icon('environment-hazard', 'Environmental Hazard', ['ghs', 'pollution', 'aquatic toxicity', 'hazard', 'safety sign'], [${DIA}, accent('M12 16.5v-3M12 13.5l-2.5-2M12 13.5l2.5-2M12 11V8.5')])`,
  ],
  security: [
    `icon('fire-alarm', 'Fire Alarm', ['call point', 'break glass', 'emergency', 'fire', 'alarm'], [body(R(4.5, 4.5, 15, 15, 2.5)), line(C(12, 12, 3.5))], ${Z})`,
  ],
  health: [
    `icon('cigarette', 'Cigarette', ['smoking', 'tobacco', 'smoke', 'cigarette', 'nicotine'], [body(R(3.5, 13, 17, 3.5, 0.8)), line('M15.5 13.2v3.1'), accent('M17 10c0-1.2 1-1.5 1-2.8M19.5 10c0-1.2 1-1.5 1-2.8')])`,
    `icon('no-smoking', 'No Smoking', ['smoking prohibited', 'no cigarettes', 'sign', 'ban', 'smoke free'], [${NO(`body(R(6.5, 11, 11, 2.5, 0.6))`)}], ${Z})`,
  ],
  devices: [
    `icon('no-phones', 'No Phones', ['phones off', 'no mobile', 'silence', 'ban', 'sign'], [${NO(`body(R(9.5, 6.5, 5, 11, 1.2))`)}], ${Z})`,
  ],
  food: [
    `icon('no-food', 'No Food', ['no eating', 'food prohibited', 'sign', 'ban', 'no snacks'], [${NO(`line('M9.5 7.5v9M14.5 7.5v3c0 1-1 1.5-1 1.5v4.5')`)}], ${Z})`,
  ],
  transport: [
    `icon('no-parking', 'No Parking', ['parking prohibited', 'tow away', 'sign', 'ban', 'street'], [${NO(`line('M10 16.5v-9h2.5a2.5 2.5 0 0 1 0 5H10')`)}], ${Z})`,
  ],
};
