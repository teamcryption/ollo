import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly, gear, scaleD, translateD } from '../src/geo.mjs';

const PIN = [body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];
const SH = [body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })];
const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const GEAR = [body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))];
const LOCK = [line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })];
const BOLT = [body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })];
const HEART_PATH = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const HEART = [body(translateD(scaleD(HEART_PATH, 0.5), 5, 4.2), { cover: true })];

const CAMERA = [body('M3 8.5A2.5 2.5 0 0 1 5.5 6h1.3l1.2-2h4l1.2 2h.3A2.5 2.5 0 0 1 16 8.5v6a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 14.5Z'), line(C(9.5, 11.2, 2.6))];
const WALLET = [body(R(3, 5, 14, 11, 2.5)), line('M16.8 8.5h-3.3a1.75 1.75 0 0 0 0 3.5h3.3')];
const GIFT = [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8')];
const BANK = [body(poly([[9.5, 3.5], [16, 7], [3, 7]], 0.8, true)), line('M5.5 9.5v5M9.5 9.5v5M13.5 9.5v5M3 17.5h12')];
const HOSPITAL = [body(R(3.5, 4, 12, 15.5, 1.5)), line('M9.5 7.5v4M7.5 9.5h4')];
const SCHOOL = [line('M9.5 6V2.8l2.5 1-2.5 1'), body(poly([[3, 11], [9.5, 6.5], [16, 11], [16, 19], [3, 19]], 1, true)), line('M8 19v-3.5h3V19')];

export default {
  category: 'interface',
  icons: [
    icon('camera-clock', 'Self-timer', ['camera timer', 'delayed shot', 'countdown', 'photo', 'timer'], [...CAMERA, ...CLOCK], { noAccent: true }),
    icon('camera-gear', 'Camera Settings', ['photo settings', 'exposure', 'camera options', 'preferences', 'photography'], [...CAMERA, ...GEAR], { noAccent: true }),
    icon('camera-bolt', 'Flash', ['camera flash', 'flash on', 'lighting', 'photo', 'strobe'], [...CAMERA, ...BOLT], { noAccent: true }),
    icon('gift-heart', 'Wish List', ['gift wishlist', 'loved gifts', 'present ideas', 'favourites', 'shopping'], [...GIFT, ...HEART], { noAccent: true }),
    icon('bank-pin', 'Branch Locator', ['find branch', 'bank location', 'nearest bank', 'atm finder', 'map'], [...BANK, ...PIN], { noAccent: true }),
    icon('bank-clock', 'Banking Hours', ['branch hours', 'bank open', 'business days', 'schedule', 'finance'], [...BANK, ...CLOCK], { noAccent: true }),
    icon('bank-shield', 'Deposit Protection', ['insured deposits', 'safe savings', 'bank security', 'protected', 'finance'], [...BANK, ...SH], { noAccent: true }),
    icon('hospital-pin', 'Nearest Hospital', ['hospital location', 'emergency room', 'clinic finder', 'healthcare', 'map'], [...HOSPITAL, ...PIN], { noAccent: true }),
    icon('hospital-clock', 'Visiting Hours', ['wait time', 'clinic hours', 'appointment time', 'healthcare', 'schedule'], [...HOSPITAL, ...CLOCK], { noAccent: true }),
    icon('hospital-search', 'Find a Clinic', ['doctor search', 'clinic search', 'healthcare finder', 'provider lookup', 'medical'], [...HOSPITAL, ...LENS], { noAccent: true }),
    icon('school-pin', 'School Location', ['school address', 'campus', 'school finder', 'education', 'map'], [...SCHOOL, ...PIN], { noAccent: true }),
    icon('school-clock', 'School Hours', ['term time', 'school day', 'bell times', 'timetable', 'education'], [...SCHOOL, ...CLOCK], { noAccent: true }),
  ],
};
