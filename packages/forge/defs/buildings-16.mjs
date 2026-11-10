import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, poly, gear, star } from '../src/geo.mjs';

const PIN = [body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];
const SH = [body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })];
const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const GEAR = [body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))];
const STAR = [body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })];
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));
const OFFICE = [body(R(4, 3.5, 11, 16, 1.5)), line('M7 7h1.5M10.5 7H12M7 10.5h1.5M10.5 10.5H12M7 14h1.5')];
const SHOP = [line('M3 9 4.5 4.5h10L16 9'), body(R(4, 9, 11, 10, 1.2)), line('M7.5 19v-4h3v4')];

export default {
  category: 'buildings',
  icons: [
    icon('building-pin', 'Office Location', ['office address', 'headquarters', 'business location', 'workplace', 'map'], [...OFFICE, ...PIN], { noAccent: true }),
    icon('building-search', 'Property Search', ['find office', 'commercial property', 'real estate', 'workspace search', 'lookup'], [...OFFICE, ...LENS], { noAccent: true }),
    icon('building-shield', 'Business Insurance', ['commercial cover', 'property insurance', 'office security', 'protected', 'business'], [...OFFICE, ...SH], { noAccent: true }),
    icon('building-clock', 'Office Hours', ['business hours', 'opening times', 'work hours', 'schedule', 'office'], [...OFFICE, ...CLOCK], { noAccent: true }),
    icon('building-gear', 'Facility Management', ['facilities', 'building services', 'maintenance', 'property management', 'settings'], [...OFFICE, ...GEAR], { noAccent: true }),
    icon('ai-building', 'Smart Building', ['building automation', 'proptech', 'smart office', 'iot', 'ai'], [...OFFICE, spark(19, 5, 2.2)], { anim: 'pulse' }),
    icon('store-pin', 'Store Locator', ['find store', 'shop location', 'nearest branch', 'retail', 'map'], [...SHOP, ...PIN], { noAccent: true }),
    icon('store-clock', 'Opening Hours', ['shop hours', 'store hours', 'open now', 'trading hours', 'retail'], [...SHOP, ...CLOCK], { noAccent: true }),
    icon('store-search', 'Find a Shop', ['store search', 'browse shops', 'marketplace search', 'retail', 'lookup'], [...SHOP, ...LENS], { noAccent: true }),
    icon('store-star', 'Favourite Store', ['top seller', 'featured shop', 'preferred store', 'retail', 'favourites'], [...SHOP, ...STAR], { noAccent: true }),
  ],
};
