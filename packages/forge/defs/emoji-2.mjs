import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'emoji',
  icons: [
    icon('aries', 'Aries', ['zodiac', 'ram', 'astrology', 'horoscope', 'star sign'], [line('M12 20.5V9.5c0-3 2-5 4-5s3.5 1.5 3.5 3.5-1 3-2.5 3M12 9.5c0-3-2-5-4-5S4.5 6 4.5 8s1 3 2.5 3')], { noAccent: true }),
    icon('taurus', 'Taurus', ['zodiac', 'bull', 'astrology', 'horoscope', 'star sign'], [line(C(12, 15, 5)), line('M4.5 4.5c0 3.5 3.3 5.5 7.5 5.5s7.5-2 7.5-5.5')], { noAccent: true }),
    icon('gemini', 'Gemini', ['zodiac', 'twins', 'astrology', 'horoscope', 'star sign'], [line('M5 4.5c4.5 1.5 9.5 1.5 14 0M5 19.5c4.5-1.5 9.5-1.5 14 0M9 5.6v12.8M15 5.6v12.8')], { noAccent: true }),
    icon('leo', 'Leo', ['zodiac', 'lion', 'astrology', 'horoscope', 'star sign'], [line('M6.5 17.5A2.5 2.5 0 1 1 9 15c0-4-2-5-2-8a4.5 4.5 0 0 1 9 0c0 4-3 6-3 9.5a2.5 2.5 0 0 0 5 0')], { noAccent: true }),
    icon('libra', 'Libra', ['zodiac', 'scales', 'astrology', 'horoscope', 'star sign'], [line('M4.5 19.5h15M4.5 15h4.3a4 4 0 1 1 6.4 0h4.3')], { noAccent: true }),
    icon('sagittarius', 'Sagittarius', ['zodiac', 'archer', 'astrology', 'horoscope', 'star sign'], [line('M5 19 19 5M12 5h7v7M7 11l6 6')], { noAccent: true }),
    icon('aquarius', 'Aquarius', ['zodiac', 'water bearer', 'astrology', 'horoscope', 'star sign'], [line('M4 10l2.7-2.5 2.7 2.5 2.6-2.5 2.6 2.5 2.7-2.5L20 10M4 16.5l2.7-2.5 2.7 2.5 2.6-2.5 2.6 2.5 2.7-2.5 2.7 2.5')], { noAccent: true }),
    icon('pisces', 'Pisces', ['zodiac', 'fish', 'astrology', 'horoscope', 'star sign'], [line('M6 4.5c3 2 4.5 4.5 4.5 7.5s-1.5 5.5-4.5 7.5M18 4.5c-3 2-4.5 4.5-4.5 7.5s1.5 5.5 4.5 7.5M5 12h14')], { noAccent: true }),
    icon('scorpio', 'Scorpio', ['zodiac', 'scorpion', 'astrology', 'horoscope', 'star sign'], [line('M4.5 7v10M4.5 9a2.5 2.5 0 0 1 5 0v8M9.5 9a2.5 2.5 0 0 1 5 0v7.5a2 2 0 0 0 2 2h3m-2-2 2 2-2 2')], { noAccent: true }),
    icon('virgo', 'Virgo', ['zodiac', 'maiden', 'astrology', 'horoscope', 'star sign'], [line('M4.5 7v10M4.5 9a2.5 2.5 0 0 1 5 0v8M9.5 9a2.5 2.5 0 0 1 5 0v6.5c0 2.5 1.5 4 4 4M14.5 13c1-2 3-2.5 4-1.5s.5 3.5-2 5.5')], { noAccent: true }),
  ],
};
