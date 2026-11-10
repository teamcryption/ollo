import { B, combos } from './mods.mjs';
import './b153.mjs';
import './b155.mjs';
import './b157.mjs';
import './b158.mjs';
import './b159.mjs';
Object.assign(B, {
  sofa: `line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2')`,
  syringe: `line('M9.5 3.5v2M7.5 3.5h4'), body(R(7.5, 5.5, 4, 9, 1)), line('M9.5 14.5v3'), line('M7.7 8.3h1.8M7.7 11h1.8')`,
  'baby-bottle': `body('M8 3.5h3v2l1.5 2V16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 16V7.5L8 5.5Z'), line('M6.7 10.5h5.6')`,
  contract: `body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0')`,
});
export default combos([
  ['atm', 'clock', '24h ATM', 'open all hours, cash machine, banking, atm', 'finance'],
  ['atm', 'shield', 'Secure ATM', 'safe cash machine, card protection, banking, atm', 'finance'],
  ['eye', 'gear', 'Visibility Settings', 'view options, display preferences, visibility, eye', 'interface'],
  ['wrench', 'bolt', 'Quick Fix', 'fast repair, hotfix, express service, wrench', 'tools'],
  ['shirt', 'star', 'Trending Outfit', 'popular style, top fashion, featured, shirt', 'fashion'],
  ['shirt', 'pin', 'Boutique Nearby', 'clothes shop location, fashion store, map, shirt', 'fashion'],
  ['soccer', 'search', 'Find a Match', 'fixtures search, games, football, sport', 'sports'],
  ['mountain', 'star', 'Top Hike', 'best trail, scenic route, featured, mountain', 'nature'],
  ['mountain', 'clock', 'Hike Duration', 'trail time, walking time, route length, mountain', 'nature'],
  ['fridge', 'gear', 'Fridge Settings', 'temperature settings, smart fridge, configure, kitchen', 'home'],
  ['washer', 'gear', 'Wash Programs', 'laundry settings, cycle options, configure, laundry', 'home'],
  ['washer', 'bolt', 'Quick Wash', 'express cycle, fast laundry, 15 minute wash, laundry', 'home'],
  ['oven', 'gear', 'Oven Settings', 'temperature, cooking mode, configure, kitchen', 'home'],
  ['terminal', 'clock', 'Cron Job', 'scheduled script, automation, timer, command line', 'development'],
  ['pizza', 'star', 'Top Pizza', 'best pizzeria, rated, favourite, pizza', 'food'],
  ['passport', 'pin', 'Embassy', 'consulate location, visa office, travel documents, passport', 'travel'],
  ['suitcase', 'shield', 'Luggage Insurance', 'baggage cover, protected luggage, travel, suitcase', 'travel'],
  ['coffee', 'search', 'Find a Cafe', 'coffee shop search, cafes, nearby, coffee', 'food'],
  ['paw', 'star', 'Best in Show', 'top pet, award, champion, paw', 'animals'],
  ['sofa', 'heart', 'Favourite Furniture', 'saved furniture, wishlist, living room, sofa', 'home'],
  ['sofa', 'pin', 'Furniture Store', 'furniture shop location, showroom, map, sofa', 'home'],
  ['sofa', 'search', 'Find Furniture', 'furniture search, browse sofas, shop, sofa', 'home'],
  ['syringe', 'clock', 'Vaccine Schedule', 'immunisation dates, booster due, health, vaccine', 'health'],
  ['syringe', 'pin', 'Vaccination Centre', 'clinic location, jab centre, health, vaccine', 'health'],
  ['syringe', 'shield', 'Immunity', 'protected, vaccinated, immune, vaccine', 'health'],
  ['baby-bottle', 'clock', 'Feeding Time', 'baby feeding schedule, bottle time, infant, baby', 'people'],
  ['contract', 'clock', 'Contract Expiry', 'renewal date, term end, agreement, contract', 'business'],
  ['contract', 'search', 'Review Contract', 'contract lookup, legal review, agreement, contract', 'business'],
  ['contract', 'lock', 'Signed and Sealed', 'executed contract, locked agreement, final, contract', 'business'],
  ['contract', 'shield', 'Legal Protection', 'legal cover, protected agreement, compliance, contract', 'business'],
]);
