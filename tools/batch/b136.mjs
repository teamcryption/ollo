const HEARTP = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const M = {
  search: `body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')`,
  clock: `body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')`,
  shield: `body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })`,
  gear: `body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))`,
  pin: `body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))`,
  star: `body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })`,
  bolt: `body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })`,
  lock: `line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })`,
  heart: `body(translateD(scaleD('${HEARTP}', 0.42), 5.3, 4.8), { cover: true })`,
};
const B = {
  airplane: `body('M9.5 3.5c.8 0 1.2.8 1.2 1.8V9l5 3v1.8l-5-1.5v3.5l1.8 1.4V19l-3-.9-3 .9v-1.8l1.8-1.4v-3.5l-5 1.5V12l5-3V5.3c0-1 .4-1.8 1.2-1.8Z')`,
  book: `body(R(3, 4, 11, 15, 2)), line('M6 4.2v14.6')`,
  cloud: `body('M6.5 15a3.5 3.5 0 0 1-.4-7 5 5 0 0 1 9.6 1.1A3 3 0 0 1 15.5 15Z')`,
  database: `body('M3 6.5c0-1.7 2.5-3 5.5-3s5.5 1.3 5.5 3v10c0 1.7-2.5 3-5.5 3S3 18.2 3 16.5Z'), line('M3.2 6.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8')`,
  globe: `body(C(9.5, 9.5, 6.5)), line(E(9.5, 9.5, 2.7, 6.3)), line('M3.2 9.5h12.6')`,
  home: `body(poly([[3, 10.5], [9.5, 4.5], [16, 10.5], [16, 18.5], [3, 18.5]], 1, true))`,
  laptop: `body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10')`,
  music: `line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2))`,
  smartphone: `body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5')`,
  user: `body(C(9.5, 8, 3.5)), body(translateD('M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z', -2.5, 0))`,
  calendar: `body(R(3, 5, 13.5, 12.5, 2.5)), line('M3.2 9h13.1M6.5 3.5v3M13 3.5v3')`,
};
const LIST = [
  ['airplane', 'heart', 'Saved Flights', 'favourite flights, wishlist, travel, trips', 'travel'],
  ['airplane', 'star', 'Top Flight', 'best airline, rated flight, premium, travel', 'travel'],
  ['airplane', 'gear', 'Flight Settings', 'flight preferences, booking options, travel settings, configure', 'travel'],
  ['book', 'heart', 'Favourite Book', 'liked book, wishlist, reading, library', 'education'],
  ['book', 'gear', 'Library Settings', 'reading preferences, ebook settings, configure, catalogue', 'education'],
  ['book', 'shield', 'Protected Book', 'copyright, drm, licensed content, publishing', 'education'],
  ['cloud', 'clock', 'Scheduled Backup', 'cloud backup, sync schedule, history, storage', 'interface'],
  ['cloud', 'bolt', 'Fast Cloud', 'instant sync, edge, quick upload, performance', 'interface'],
  ['cloud', 'star', 'Featured Cloud', 'premium storage, top service, favourite drive, cloud', 'interface'],
  ['database', 'bolt', 'Fast Database', 'cache, performance, quick query, speed', 'development'],
  ['database', 'star', 'Starred Database', 'favourite database, primary, featured, data', 'development'],
  ['database', 'pin', 'Data Region', 'data residency, server location, region, storage', 'development'],
  ['globe', 'search', 'Web Search', 'search the web, browse, internet, lookup', 'maps'],
  ['globe', 'clock', 'Global Time', 'time zones, world time, international, schedule', 'maps'],
  ['globe', 'heart', 'Love the Planet', 'earth day, environment, global care, world', 'maps'],
  ['globe', 'star', 'Top Destination', 'featured place, popular, worldwide, travel', 'maps'],
  ['home', 'clock', 'Home Time', 'arrival time, check in, house schedule, home', 'home'],
  ['home', 'lock', 'Home Security', 'locked house, secure home, alarm, protected', 'home'],
  ['home', 'heart', 'Dream Home', 'favourite home, saved property, wishlist, house', 'home'],
  ['laptop', 'search', 'Computer Search', 'find on computer, device search, lookup, laptop', 'devices'],
  ['laptop', 'clock', 'Screen Time', 'usage time, work hours, timer, laptop', 'devices'],
  ['laptop', 'heart', 'Favourite Device', 'liked laptop, wishlist, computer, love', 'devices'],
  ['laptop', 'star', 'Top Laptop', 'best computer, rated device, featured, laptop', 'devices'],
  ['music', 'lock', 'Locked Track', 'premium song, protected audio, drm, music', 'media'],
  ['music', 'pin', 'Local Music', 'concerts nearby, venue, local artists, music', 'media'],
  ['music', 'bolt', 'Music Boost', 'energy playlist, workout music, power, upbeat', 'media'],
  ['music', 'shield', 'Licensed Music', 'royalty free, copyright, protected audio, music', 'media'],
  ['smartphone', 'search', 'Phone Search', 'find on phone, device search, app search, mobile', 'devices'],
  ['smartphone', 'heart', 'Favourite App', 'liked app, saved, mobile, love', 'devices'],
  ['smartphone', 'star', 'Top App', 'rated app, featured, app store, mobile', 'devices'],
  ['user', 'shield', 'Protected Account', 'account security, verified user, safe profile, privacy', 'people'],
  ['user', 'bolt', 'Power User', 'pro user, active member, expert, fast', 'people'],
  ['calendar', 'shield', 'Secure Calendar', 'private calendar, protected events, privacy, schedule', 'time'],
  ['calendar', 'bolt', 'Quick Event', 'instant meeting, fast booking, express, schedule', 'time'],
];
const out = {};
for (const [b, m, title, tags, cat] of LIST) {
  const t = tags.split(', ').concat([b]).map((x) => `'${x}'`).join(', ');
  (out[cat] ??= []).push(`icon('${b}-${m}', '${title}', [${t}], [${B[b]}, ${M[m]}], { noAccent: true })`);
}
export default out;
