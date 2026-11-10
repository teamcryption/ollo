const T = `{ dir: 'right', turns: { left: 180, up: -90, down: 90 } }`;
const Z = `{ noAccent: true }`;
export default {
  arrows: [
    `icon('arrow-dashed-right', 'Dashed Arrow Right', ['dashed', 'path', 'next', 'right', 'arrow'], [line('M3.5 12h3M9 12h3M14.5 12h5'), line(head(20, 12, 0, 4))], ${T})`,
    `icon('arrow-from-dot-right', 'Arrow From Dot Right', ['start', 'origin', 'launch', 'right', 'arrow'], [body(C(5.5, 12, 2.5)), line('M8 12h11.5'), line(head(20, 12, 0, 4))], ${T})`,
    `icon('arrows-double-right', 'Double Arrows Right', ['parallel', 'sync', 'both', 'right', 'arrows'], [line('M4 8.5h14.5M4 15.5h14.5'), line(head(19, 8.5, 0, 3.5)), line(head(19, 15.5, 0, 3.5))], ${T})`,
    `icon('arrow-arc-right', 'Arc Arrow Right', ['arc', 'jump over', 'skip', 'right', 'arrow'], [line('M4 16.5C4 10 8 7 12 7s8 3 8 8.5'), line(head(20, 16.5, 90, 4))], ${T})`,
  ],
  emoji: [
    `icon('aries', 'Aries', ['zodiac', 'ram', 'astrology', 'horoscope', 'star sign'], [line('M12 20.5V9.5c0-3 2-5 4-5s3.5 1.5 3.5 3.5-1 3-2.5 3M12 9.5c0-3-2-5-4-5S4.5 6 4.5 8s1 3 2.5 3')], ${Z})`,
    `icon('taurus', 'Taurus', ['zodiac', 'bull', 'astrology', 'horoscope', 'star sign'], [line(C(12, 15, 5)), line('M4.5 4.5c0 3.5 3.3 5.5 7.5 5.5s7.5-2 7.5-5.5')], ${Z})`,
    `icon('gemini', 'Gemini', ['zodiac', 'twins', 'astrology', 'horoscope', 'star sign'], [line('M5 4.5c4.5 1.5 9.5 1.5 14 0M5 19.5c4.5-1.5 9.5-1.5 14 0M9 5.6v12.8M15 5.6v12.8')], ${Z})`,
    `icon('leo', 'Leo', ['zodiac', 'lion', 'astrology', 'horoscope', 'star sign'], [line('M6.5 17.5A2.5 2.5 0 1 1 9 15c0-4-2-5-2-8a4.5 4.5 0 0 1 9 0c0 4-3 6-3 9.5a2.5 2.5 0 0 0 5 0')], ${Z})`,
    `icon('libra', 'Libra', ['zodiac', 'scales', 'astrology', 'horoscope', 'star sign'], [line('M4.5 19.5h15M4.5 15h4.3a4 4 0 1 1 6.4 0h4.3')], ${Z})`,
    `icon('sagittarius', 'Sagittarius', ['zodiac', 'archer', 'astrology', 'horoscope', 'star sign'], [line('M5 19 19 5M12 5h7v7M7 11l6 6')], ${Z})`,
    `icon('aquarius', 'Aquarius', ['zodiac', 'water bearer', 'astrology', 'horoscope', 'star sign'], [line('M4 10l2.7-2.5 2.7 2.5 2.6-2.5 2.6 2.5 2.7-2.5L20 10M4 16.5l2.7-2.5 2.7 2.5 2.6-2.5 2.6 2.5 2.7-2.5 2.7 2.5')], ${Z})`,
    `icon('pisces', 'Pisces', ['zodiac', 'fish', 'astrology', 'horoscope', 'star sign'], [line('M6 4.5c3 2 4.5 4.5 4.5 7.5s-1.5 5.5-4.5 7.5M18 4.5c-3 2-4.5 4.5-4.5 7.5s1.5 5.5 4.5 7.5M5 12h14')], ${Z})`,
    `icon('scorpio', 'Scorpio', ['zodiac', 'scorpion', 'astrology', 'horoscope', 'star sign'], [line('M4.5 7v10M4.5 9a2.5 2.5 0 0 1 5 0v8M9.5 9a2.5 2.5 0 0 1 5 0v7.5a2 2 0 0 0 2 2h3m-2-2 2 2-2 2')], ${Z})`,
    `icon('virgo', 'Virgo', ['zodiac', 'maiden', 'astrology', 'horoscope', 'star sign'], [line('M4.5 7v10M4.5 9a2.5 2.5 0 0 1 5 0v8M9.5 9a2.5 2.5 0 0 1 5 0v6.5c0 2.5 1.5 4 4 4M14.5 13c1-2 3-2.5 4-1.5s.5 3.5-2 5.5')], ${Z})`,
  ],
  gaming: [
    `icon('suit-diamond', 'Diamond Suit', ['diamonds', 'playing card', 'poker', 'casino', 'cards'], [body(poly([[12, 3.5], [18.5, 12], [12, 20.5], [5.5, 12]], 1.5, true))], ${Z})`,
    `icon('suit-club', 'Club Suit', ['clubs', 'playing card', 'poker', 'casino', 'cards'], [body(C(12, 7.5, 3)), body(C(7.5, 13, 3)), body(C(16.5, 13, 3)), body(poly([[12, 13], [14.5, 20.5], [9.5, 20.5]], 0.8, true))], ${Z})`,
  ],
  media: [
    `icon('sharp-sign', 'Sharp', ['music sharp', 'accidental', 'note', 'key signature', 'semitone up'], [line('M9.5 4.5v15M14.5 4.5v15M5.5 10l13-2.5M5.5 16.5l13-2.5')], ${Z})`,
    `icon('flat-sign', 'Flat', ['music flat', 'accidental', 'note', 'key signature', 'semitone down'], [line('M8 3.5V20c4-1.5 8-3.5 8-6.5 0-2.5-2.5-3.5-4.5-2.8S8 13 8 13')], ${Z})`,
    `icon('natural-sign', 'Natural', ['music natural', 'accidental', 'note', 'cancel', 'key signature'], [line('M8.5 4v11.5l7-2M15.5 20V8.5l-7 2')], ${Z})`,
    `icon('bass-clef', 'Bass Clef', ['f clef', 'music', 'notation', 'low notes', 'stave'], [line('M5 9a5 5 0 0 1 10 0c0 6-5 9.5-10 11'), body(C(6.5, 9.2, 1.7)), body(C(18.5, 7.5, 1.2)), body(C(18.5, 12, 1.2))], ${Z})`,
  ],
  people: [
    `icon('gender-male', 'Male', ['man', 'mars symbol', 'gender', 'sex', 'boy'], [line(C(10, 14, 5.5)), line('M14 10l5.5-5.5M14.5 4.5h5v5')], ${Z})`,
    `icon('gender-female', 'Female', ['woman', 'venus symbol', 'gender', 'sex', 'girl'], [line(C(12, 9, 5.5)), line('M12 14.5v6M9 17.5h6')], ${Z})`,
    `icon('gender-neutral', 'Gender Neutral', ['non-binary', 'neutral', 'gender', 'inclusive', 'agender'], [line(C(12, 9, 5.5)), line('M12 14.5v6')], ${Z})`,
  ],
};
