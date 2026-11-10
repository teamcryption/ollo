import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, poly, star } from '../src/geo.mjs';

const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];
const STAR = [body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })];
const PIN = [body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))];
const BOOK = [body(R(3, 4, 11, 15, 2)), line('M6 4.2v14.6')];
const NOTE = [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2))];
const MSG = [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z')];
const IMG = [body(R(3, 4, 14, 11.5, 2)), line('M5.5 12.5l2.8-2.8 2.2 2.2'), line(D(13, 7.5))];
const CAL = [body(R(3, 5, 13.5, 12.5, 2.5)), line('M3.2 9h13.1M6.5 3.5v3M13 3.5v3')];
const PINMAP = [body('M9.5 18.5s-6-5.2-6-9.6a6 6 0 0 1 12 0c0 1.1-.4 2.3-1 3.4'), line(C(9.5, 8.9, 2))];

export default {
  category: 'interface',
  icons: [
    icon('book-star', 'Favourite Book', ['starred book', 'must read', 'recommended', 'favourites', 'reading list'], [...BOOK, ...STAR], { noAccent: true }),
    icon('music-star', 'Favourite Song', ['liked song', 'starred track', 'top track', 'favourites', 'playlist'], [...NOTE, ...STAR], { noAccent: true }),
    icon('message-star', 'Starred Message', ['important message', 'saved chat', 'pinned message', 'favourites', 'chat'], [...MSG, ...STAR], { noAccent: true }),
    icon('book-clock', 'Due Date', ['library due', 'return book', 'loan period', 'reading time', 'borrow'], [...BOOK, ...CLOCK], { noAccent: true }),
    icon('location-clock', 'Arrival Time', ['eta', 'time to destination', 'trip duration', 'travel time', 'map'], [...PINMAP, ...CLOCK], { noAccent: true }),
    icon('music-clock', 'Sleep Timer', ['music timer', 'playback timer', 'auto stop', 'bedtime audio', 'audio'], [...NOTE, ...CLOCK], { noAccent: true }),
    icon('smartphone-clock', 'Screen Time', ['phone usage', 'digital wellbeing', 'app limits', 'usage time', 'device'], [body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5'), ...CLOCK], { noAccent: true }),
    icon('browser-search', 'Web Search', ['search the web', 'internet search', 'search engine', 'browse', 'lookup'], [body(R(3, 4, 15, 12, 2)), line('M3.2 7.5h14.6'), ...LENS], { noAccent: true }),
    icon('home-pin', 'Home Address', ['home location', 'address', 'where i live', 'residence', 'map'], [body(poly([[3, 10.5], [9.5, 4.5], [16, 10.5], [16, 18.5], [3, 18.5]], 1, true)), ...PIN], { noAccent: true }),
    icon('image-pin', 'Geotagged Photo', ['photo location', 'geotag', 'where taken', 'travel photo', 'map'], [...IMG, ...PIN], { noAccent: true }),
    icon('calendar-pin', 'Event Location', ['venue', 'meeting place', 'event address', 'where', 'calendar'], [...CAL, ...PIN], { noAccent: true }),
  ],
};
