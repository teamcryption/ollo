import { B, combos } from './mods.mjs';
import './b150.mjs';
import './b151.mjs';
import './b152.mjs';
import './b153.mjs';
Object.assign(B, {
  gamepad: `body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2')`,
});
const all = combos([
  ['printer', 'pin', 'Printer Location', 'nearest printer, print station, office map, printer', 'devices'],
  ['router', 'bolt', 'Fast Internet', 'high speed broadband, gigabit, fibre, internet', 'devices'],
  ['router', 'search', 'Network Devices', 'scan devices, connected devices, lookup, internet', 'devices'],
  ['coffee', 'bolt', 'Energy Boost', 'caffeine, espresso shot, pick me up, coffee', 'food'],
  ['bed', 'pin', 'Hotel Nearby', 'accommodation location, place to stay, map, bed', 'travel'],
  ['bed', 'search', 'Find a Hotel', 'hotel search, accommodation, booking, bed', 'travel'],
  ['bike', 'search', 'Find a Bike', 'bike rental search, cycle hire, bicycle, nearby', 'transport'],
  ['bike', 'gear', 'Bike Service', 'bike repair, maintenance, cycle shop, bicycle', 'transport'],
  ['bike', 'shield', 'Bike Insurance', 'cycle cover, theft protection, insured, bicycle', 'transport'],
  ['bike', 'bolt', 'E-Bike', 'electric bike, ebike, pedal assist, bicycle', 'transport'],
  ['tent', 'star', 'Top Campsite', 'best campsite, rated camping, glamping, tent', 'travel'],
  ['tent', 'search', 'Find Campsite', 'campsite search, camping spots, outdoors, tent', 'travel'],
  ['bus', 'search', 'Find Bus Route', 'route planner, bus lookup, journey, public transport', 'transport'],
  ['bus', 'bolt', 'Express Bus', 'fast bus, limited stops, coach, public transport', 'transport'],
  ['train', 'search', 'Find Train', 'journey planner, train search, rail, public transport', 'transport'],
  ['train', 'bolt', 'High Speed Rail', 'bullet train, express rail, fast train, public transport', 'transport'],
  ['fuel', 'search', 'Find Fuel', 'petrol price, gas station search, refuel, fuel', 'transport'],
  ['link', 'bolt', 'Quick Link', 'shortcut, fast link, instant share, url', 'interface'],
  ['plug', 'pin', 'Charging Point', 'socket location, plug in, power outlet, energy', 'energy'],
  ['plug', 'lock', 'Child Safe Socket', 'socket lock, safety, child proof, energy', 'energy'],
  ['mic', 'shield', 'Mic Privacy', 'microphone protection, privacy, secure audio, voice', 'media'],
  ['headphones', 'clock', 'Listening Time', 'listening history, audio time, playback, headphones', 'media'],
  ['phone', 'shield', 'Spam Protection', 'call blocking, scam protection, safe calls, phone', 'communication'],
  ['card', 'pin', 'Card Accepted', 'payment accepted here, merchant, card terminal, payment', 'finance'],
  ['gamepad', 'heart', 'Favourite Game', 'liked game, wishlist, gaming, controller', 'gaming'],
  ['gamepad', 'clock', 'Playtime', 'game time, screen time, gaming session, controller', 'gaming'],
  ['gamepad', 'star', 'Top Game', 'best game, featured, rated game, controller', 'gaming'],
  ['gamepad', 'lock', 'Game Parental Lock', 'restricted games, age rating, parental control, controller', 'gaming'],
  ['gamepad', 'search', 'Find Games', 'game search, browse games, store, controller', 'gaming'],
  ['gamepad', 'gear', 'Controller Settings', 'gamepad config, button mapping, gaming, controller', 'gaming'],
]);
export default all;
